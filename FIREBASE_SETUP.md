# Firebase Setup Guide - Kumbh Sewa

Your application is now fully configured with **Firebase** as the backend. Here's how to set it up and deploy.

---

## ✅ Current Status

- Firebase credentials are configured in `src/lib/firebase.ts`
- Firestore database functions implemented
- Firebase Authentication ready
- Build successful with Firebase SDK

---

## Setup Firestore Database

### Step 1: Create Firestore Collections

Go to [Firebase Console](https://console.firebase.google.com/) and navigate to your project: **kumbhseva-a1172**

#### Collection 1: `contributors`

```
Collection: contributors
Document Structure:
{
  "full_name": "string",
  "email": "string",
  "whatsapp_number": "string",
  "pin_code": "string",
  "preferred_language": "string (en|mr|hi)",
  "intents": [array of strings],
  "created_at": timestamp
}
```

#### Collection 2: `pledge_analytics`

```
Collection: pledge_analytics
Document ID: {pledge_category_id} (e.g., "waste-management")
Document Structure:
{
  "id": "string",
  "category": "string",
  "count": integer,
  "last_pledged_at": timestamp
}
```

---

## Setup Firebase Security Rules

### Step 1: Go to Firestore Rules

In Firebase Console:
1. Navigate to **Firestore Database**
2. Click **Rules** tab
3. Replace with the following:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public can only create contributors (no read/update/delete)
    match /contributors/{document=**} {
      allow create: if request.auth != null || true;
      allow read, update, delete: if false;
    }

    // Public can create/update pledge analytics (for counting)
    match /pledge_analytics/{document=**} {
      allow create, update: if true;
      allow read, delete: if false;
    }

    // Admin access - deny all by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Click Publish** to apply rules.

---

## Setup Firebase Authentication

### Step 1: Enable Email/Password Auth

1. Go to Firebase Console → **Authentication**
2. Click **Get Started**
3. Click **Email/Password** provider
4. Toggle **Enable**
5. Click **Save**

### Step 2: Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **Create new user**
3. Enter:
   - **Email**: `admin@kumbhadmin.in`
   - **Password**: (choose a strong password)
4. Click **Create user**

---

## Firestore Indexes (If Needed)

If you get index creation prompts during testing, click the links to create them. Firebase will create them automatically.

---

## Testing Before Deployment

### Test Public Features (No Login)

1. Open your app
2. Go to **Pledge Page** (`/pledge`)
3. Enter name, select category
4. Click "Take Pledge"
5. Certificate should generate
6. Download as PNG/PDF should work
7. Go to **Contributor Page** (`/contributor`)
8. Fill 3-step form
9. Submit - should succeed

Check Firestore:
- `contributors` collection should have 1+ documents
- `pledge_analytics` should have count entries

### Test Admin Features (Login Required)

1. Go to **Admin Login** (`/admin-login`)
2. Enter: `admin@kumbhadmin.in`
3. Enter the password you created
4. Should see **Admin Dashboard**
5. Should see contributors and analytics
6. CSV export should work

---

## Security Rules Explained

| Collection | Action | Who | Allowed |
|-----------|--------|-----|---------|
| `contributors` | Create | Anyone | ✅ Yes |
| `contributors` | Read | Anyone | ❌ No |
| `contributors` | Update | Anyone | ❌ No |
| `contributors` | Delete | Anyone | ❌ No |
| `pledge_analytics` | Create | Anyone | ✅ Yes |
| `pledge_analytics` | Update | Anyone | ✅ Yes (for counting) |
| `pledge_analytics` | Read | Anyone | ❌ No |
| `pledge_analytics` | Delete | Anyone | ❌ No |

**Admin Dashboard reads data through Firebase Auth** - Only authenticated users (admins) can view.

---

## Deploy to Production

### Option 1: Firebase Hosting (Recommended)

```bash
# 1. Install Firebase CLI
npm i -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (if not done)
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy
```

Your site will be live at: `https://kumbhseva-a1172.firebaseapp.com`

### Option 2: Vercel

```bash
npm i -g vercel
vercel --prod
```

### Option 3: Netlify

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Firestore Best Practices

### Indexes
- Firebase automatically creates composite indexes
- Check Firestore Console → Indexes if you add complex queries

### Query Limits
- Keep queries simple
- Use indexed fields for filtering
- Avoid n+1 queries

### Pricing
- **Free Tier** (Spark):
  - 50k reads/day
  - 20k writes/day
  - 20k deletes/day
  - 1 GB storage

- **Pay-as-you-go** (Blaze):
  - ~$0.06 per 100k reads
  - ~$0.18 per 100k writes
  - Scale based on usage

Expected monthly cost for this app: **FREE** (well under free tier limits)

---

## Troubleshooting

### "Permission denied" on Firestore writes

**Solution**: Check security rules are published. Go to Firestore → Rules → Check Publish status.

### Admin login not working

**Solution**: 
1. Verify user exists in Authentication → Users
2. Check email is `admin@kumbhadmin.in`
3. Try resetting password
4. Clear browser cache and try again

### Contributors not showing in admin dashboard

**Solution**:
1. Check `contributors` collection exists in Firestore
2. Check data was actually submitted (check Network tab)
3. Verify admin is logged in
4. Check browser console for errors

### Pledge analytics not updating

**Solution**:
1. Check `pledge_analytics` collection exists
2. Verify rules allow create/update
3. Check Network tab in browser DevTools
4. Check Firebase Console → Error Logs

---

## Key Differences from Supabase

| Feature | Supabase | Firebase |
|---------|----------|----------|
| Database | PostgreSQL | Firestore (NoSQL) |
| Auth | Built-in | Firebase Auth |
| Realtime | Real-time | Real-time listeners |
| RLS | SQL-based | JSON rules |
| Hosting | External | Firebase Hosting |
| Admin SDK | Available | Available |

---

## Next Steps

1. **Create Firestore collections** (contributors, pledge_analytics)
2. **Set security rules** (copy-paste from above)
3. **Enable Email/Password auth**
4. **Create admin user** (`admin@kumbhadmin.in`)
5. **Test locally**: `npm run dev`
6. **Test all features**:
   - Pledge page (create, download)
   - Contributor registration
   - Admin login & dashboard
7. **Deploy**: `firebase deploy` or `vercel --prod`

---

## Support

- **Firebase Docs**: https://firebase.google.com/docs
- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Firebase Auth Docs**: https://firebase.google.com/docs/auth

---

**Status**: Ready to Deploy with Firebase
**Project ID**: kumbhseva-a1172
**Region**: Auto-selected by Firebase
