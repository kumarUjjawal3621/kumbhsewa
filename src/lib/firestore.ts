import { supabase } from './supabase';

export async function submitContributor(data: {
  fullName: string;
  email: string;
  whatsappNumber: string;
  pinCode: string;
  preferredLanguage: string;
  intents: string[];
}) {
  const { error } = await supabase.from('contributors').insert({
    full_name: data.fullName,
    email: data.email,
    whatsapp_number: data.whatsappNumber,
    pin_code: data.pinCode,
    preferred_language: data.preferredLanguage,
    intents: data.intents,
  });
  if (error) throw error;
}

export async function incrementPledgeCount(categoryId: string) {
  // Try to update existing record
  const { data: existing } = await supabase
    .from('pledge_analytics')
    .select('count')
    .eq('id', categoryId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('pledge_analytics')
      .update({
        count: existing.count + 1,
        last_pledged_at: new Date().toISOString(),
      })
      .eq('id', categoryId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('pledge_analytics').insert({
      id: categoryId,
      category: categoryId,
      count: 1,
      last_pledged_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
}

export async function getContributors() {
  const { data, error } = await supabase
    .from('contributors')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    whatsappNumber: row.whatsapp_number,
    pinCode: row.pin_code,
    preferredLanguage: row.preferred_language,
    intents: row.intents || [],
    createdAt: row.created_at,
  }));
}

export async function getPledgeAnalytics() {
  const { data, error } = await supabase
    .from('pledge_analytics')
    .select('*')
    .order('count', { ascending: false });
  if (error) throw error;
  return (data || []).map((row) => ({
    id: row.id,
    category: row.category,
    count: row.count || 0,
    lastPledgedAt: row.last_pledged_at,
  }));
}
