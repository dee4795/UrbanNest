# Admin Registration & Authorization - Visual Guide

## Admin Button Location

### Registration Form (http://localhost:4200/login)
```
┌─────────────────────────────────────┐
│  Create your UrbanNest account      │
│                                     │
│  [Login] [Register]  <- Click here  │
│                                     │
│  Full Name:                         │
│  [________________________________________]
│                                     │
│  Email:                             │
│  [________________________________________]
│                                     │
│  Password:                          │
│  [________________________________________]
│                                     │
│  ☑ Register as Admin                │ <- ADM IN CHECKBOX
│    (can delete any property)        │   CHECK THIS BOX
│                                     │
│  [Create Account ]                  │
│                                     │
└─────────────────────────────────────┘
```

## After Login - Admin Badge Location

### Desktop Navbar
```
┌─────────────────────────────────────────────────────────────┐
│  U UrbanNest                Search  List Property  About...  │
│                                    John Doe  👨‍💼 Admin  X    │
└─────────────────────────────────────────────────────────────┘
                                      └──┬─────────────┘
                                         └─ ADMIN BADGE
```

### Mobile Navbar (Hamburger Menu)
```
┌─────────────────────────────┐
│ ≡ Menu                      │
├─────────────────────────────┤
│ Search                      │
│ List Property               │
│ About Us                    │
│ Privacy Policy              │
├─────────────────────────────┤
│ John Doe                    │
│ 👨‍💼 Admin User             │  <- ADMIN BADGE
├─────────────────────────────┤
│ [ Logout ]                  │
└─────────────────────────────┘
```

## List Property Page - Admin View

```
┌────────────────────────────────────────────────────────────┐
│  All Properties (5)  ← Shows ALL properties               │
│  Admin: You can delete any property   👨‍💼 Admin Access    │
│                                       Can delete any...    │
└────────────────────────────────────────────────────────────┘

Property Cards (Admin sees ALL):
┌──────────────────────┐  ┌──────────────────────┐
│ Property 1           │  │ Property 2           │
│ [🗑️ Delete]         │  │ [🗑️ Delete]         │
└──────────────────────┘  └──────────────────────┘

┌──────────────────────┐  ┌──────────────────────┐
│ Property 3 (Other)   │  │ Property 4 (Other)   │
│ [🗑️ Delete] ← Can   │  │ [🗑️ Delete] ← Can   │
│  delete OTHER's      │  │ delete OTHER's       │
└──────────────────────┘  └──────────────────────┘
```

## List Property Page - Regular User View

```
┌────────────────────────────────────────────────────────────┐
│  My Properties (2)   ← Shows ONLY own properties          │
│  Manage your listed properties - sold out? Delete them    │
└────────────────────────────────────────────────────────────┘

Property Cards (Regular user sees only THEIRS):
┌──────────────────────┐  ┌──────────────────────┐
│ My Property 1        │  │ My Property 2        │
│ [🗑️ Delete]         │  │ [🗑️ Delete]         │
└──────────────────────┘  └──────────────────────┘

(Other users' properties not shown)
```

## Authentication Flow

### Admin Registration & Login Sequence
```
User Registers as Admin
    ↓
[Full Name] [Email] [Password] [✓ Admin Checkbox]
    ↓
Frontend: register(name, email, password, isAdmin=true)
    ↓
Backend: registerSchema validates + creates User with isAdmin=true
    ↓
Database: INSERT INTO User (name, email, passwordHash, isAdmin=true)
    ↓
Backend: returns JWT token + response with isAdmin=true + name
    ↓
Frontend: stores {token, email, name, isAdmin} in localStorage
    ↓
UI: Displays username + golden 👨‍💼 Admin badge in navbar
```

### Delete Permission Check
```
Admin tries to delete ANY property:
    ↓
POST DELETE /api/listings/{id}
    ↓
Backend checks: user.isAdmin === true
    ↓
Result: ✅ DELETE ALLOWED

Regular User tries to delete OTHER's property:
    ↓
POST DELETE /api/listings/{id}  
    ↓
Backend checks: user.isAdmin === false AND user.userId !== listing.ownerId
    ↓
Result: ❌ 403 FORBIDDEN
```

## Color Scheme

### Admin Badge
- **Background**: Gradient (Gold #fbbf24 → Orange #f59e0b)
- **Text**: White
- **Icon**: 👨‍💼

### Delete Button
- **Normal**: Red (#dc2626)
- **Hover**: Darker Red (#b91c1c)
- **Icon**: 🗑️

### Navbar Links
- **Normal**: Gray (#334155)
- **Active**: Green (#00a76f)
- **Admin Badge**: Gradient Orange

## Quick Test Checklist

- [ ] Go to registration page
- [ ] See "Register as Admin" checkbox under password
- [ ] Register with checkbox UNCHECKED (regular user)
- [ ] See username in navbar, NO admin badge
- [ ] Go to List Property - see "My Properties (x)"
- [ ] Logout and register NEW user with checkbox CHECKED (admin)
- [ ] See username + 👨‍💼 Admin badge in navbar
- [ ] Go to List Property - see "All Properties (x)"
- [ ] See golden "Admin Access" note
- [ ] Can see and delete other users' properties
- [ ] Try deleting with first user's account - should fail for others' properties
