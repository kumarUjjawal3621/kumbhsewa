# Firebase Deployment - Kumbh Sewa

Quick start guide to deploy with Firebase.

---

## Prerequisites

✅ Firebase project created: `kumbhseva-a1172`
✅ Firebase credentials configured
✅ Build successful
⚠️ Firestore collections NOT created yet (create manually first)

---

## Step 1: Setup Firestore Database (IMPORTANT!)

### Create Collections in Firebase Console

1. Go to: https://console.firebase.google.com/
2. Select: **kumbhseva-a1172**
3. Go to: **Firestore Database**
4. Click: **Create Collection**

#### Create Collection 1: `contributors`

- Collection ID: `contributors`
- Document ID: (auto-generated)
- Add your first document or skip

#### Create Collection 2: `pledge_analytics`

- Collection ID: `pledge_analytics`
- Document ID: (auto-generated)
- Add your first document or skip

---

## Step 2: Setup Security Rules

1. In Firestore, click: **Rules** tab
2. Replace all content with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contributors/{document=**} {
      allow create: if true;
      allow read, update, delete: if false;
    }
    match /pledge_analytics/{document=**} {
      allow create, update: if true;
      allow read, delete: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click: **Publish**

---

## Step 3: Enable Authentication

1. Go to: **Authentication**
2. Click: **Get Started**
3. Select: **Email/Password**
4. Toggle: **Enable**
5. Click: **Save**

---

## Step 4: Create Admin User

1. Go to: **Authentication** → **Users**
2. Click: **Create new user**
3. Enter:
   - Email: `admin@kumbhadmin.in`
   - Password: (strong password, save this!)
4. Click: **Create user**

---

## Step 5: Deploy with Firebase Hosting

### Option A: Firebase CLI (Recommended)

```bash
# 1. Install Firebase CLI
npm i -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Build your app
npm run build

# 4. Deploy
firebase deploy
```

Your site will be live at:
```
https://kumbhseva-a1172.firebaseapp.com
```

### Option B: Vercel (No Firebase Hosting)

```bash
npm i -g vercel
npm run build
vercel --prod
```

### Option C: Netlify (No Firebase Hosting)

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

---

## Step 6: Test Live Site

1. Open your deployed URL
2. Test **Pledge Page**:
   - Enter name
   - Select category
   - Take pledge
   - Download certificate (PNG/PDF)
3. Test **Contributor Registration**:
   - Fill 3-step form
   - Submit
4. Test **Admin Dashboard**:
   - Go to `/admin-login`
   - Login: `admin@kumbhadmin.in` + password
   - Should see data

---

## Verify Data in Firestore

1. Go to Firestore Console
2. Check **contributors** collection:
   - Should have submitted registrations
3. Check **pledge_analytics** collection:
   - Should have pledge counts

---

## Troubleshooting

### "Collection not found" error

**Solution**: Create collections manually in Firebase Console first.

### "Permission denied" on database operations

**Solution**: 
1. Go to Firestore → Rules
2. Verify rules are published
3. Check rules allow the operation

### Admin login fails

**Solution**:
1. Verify user exists in Authentication
2. Check email is `admin@kumbhadmin.in`
3. Try resetting password

### Site deployed but data not saving

**Solution**:
1. Open browser DevTools → Console
2. Check for errors
3. Go to Firestore and check if collections exist
4. Verify security rules are correct

---

## Costs

**Free Tier (Spark Plan)**:
- 50,000 reads/day
- 20,000 writes/day
- Sufficient for this app

**Pay-as-you-go (Blaze Plan)**:
- Only activated if you exceed free tier
- ~$0.06 per 100k reads
- Expected cost: FREE for first months

---

## Post-Deployment Checklist

- [ ] Firestore collections created
- [ ] Security rules published
- [ ] Email/Password auth enabled
- [ ] Admin user created
- [ ] App built: `npm run build`
- [ ] Deployed to Firebase/Vercel/Netlify
- [ ] Live URL working
- [ ] Pledge page works (create certificate)
- [ ] Contributor registration works
- [ ] Admin login works with `admin@kumbhadmin.in`
- [ ] CSV export works
- [ ] Data appears in Firestore

---

## Support Links

- Firebase Console: https://console.firebase.google.com/
- Firestore Docs: https://firebase.google.com/docs/firestore
- Firebase Auth: https://firebase.google.com/docs/auth
- Firebase Hosting: https://firebase.google.com/docs/hosting

---

**Ready?** Follow the 6 steps above and your site will be live in minutes!

🚀 **Expected Time**: 15-20 minutes total
