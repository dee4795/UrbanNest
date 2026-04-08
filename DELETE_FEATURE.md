# Property Delete Feature - Documentation

## Overview
Delete functionality has been successfully implemented for property listings with **admin-only access control** and **owner access**.

## How It Works

### Authorization
- **Admins**: Can delete any property
- **Owners**: Can only delete their own properties
- **Others**: Cannot delete

### Database Changes
- Added `isAdmin` boolean field to User model (default: false)
- Migration applied: `20260408_add_admin_role`

### API Endpoint
```
DELETE /api/listings/:id
Method: DELETE
Auth: Required (Bearer token)
```

**Response on Success:**
```json
{
  "message": "Listing deleted successfully."
}
```

**Response on Error:**
```json
{
  "message": "Only admin or listing owner can delete this property."
}
```

### Frontend UI

#### My Listings Section
- Shows all properties owned by current user
- Appears at the top of "List Your Home" page
- Shows property count: "My Properties (3)"

#### Delete Button
- Red delete button (🗑️) on each listing card
- Confirmation dialog before deletion
- Displays: "Are you sure you want to delete the listing 'Property Title'?"

#### Listing Card Display
Shows:
- Property title
- Purpose (Rent/Buy)
- Type (Apartment/Row House)
- Area
- BHK count
- Price (formatted with ₹)
- Address
- Image count
- Image thumbnails (first 3 + count)

### Making a Property Editable by Admin

To make a user an admin, update the PostgreSQL database:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'admin@example.com';
```

Or through the API (once you build an admin panel):
```typescript
await prisma.user.update({
  where: { email: 'admin@example.com' },
  data: { isAdmin: true }
});
```

## User Workflow

### Delete a Property (As Owner)
1. Go to "List Your Home" page
2. See "My Properties" section at top
3. Find property to delete
4. Click 🗑️ Delete button
5. Confirm deletion dialog
6. Property removed from database and UI

### Delete a Property (As Admin)
- Same process, but can delete any property
- Still see confirmation dialog for safety

## Technical Implementation

### Backend Files Changed
- `server/src/types.ts` - Added `isAdmin` to JwtClaims
- `server/src/index.ts` - Added DELETE endpoint with authorization
- `server/prisma/schema.prisma` - Added `isAdmin` field to User
- `server/prisma/migrations/20260408_add_admin_role/migration.sql` - Migration SQL

### Frontend Files Changed
- `src/app/services/property.service.ts` - Added `delete(id)` method
- `src/app/pages/list-property/list-property.component.ts` - Added delete UI logic
- `src/app/pages/list-property/list-property.component.html` - Added My Listings section
- `src/app/pages/list-property/list-property.component.css` - Added styling for listing cards

## Key Features

✅ Admin-only delete with owner override
✅ Confirmation dialog to prevent accidental deletion
✅ Real-time UI update after deletion
✅ Error handling with user feedback
✅ Responsive listing cards grid
✅ Image thumbnails in preview
✅ Property count badge

## Testing Delete Feature

### Test Case 1: Owner Deletes Own Property
1. Log in as regular user
2. Create a property
3. Go to "List Your Home"
4. Delete the property
5. Confirm deletion
6. Property removed from "My Properties"

### Test Case 2: Non-Owner Cannot Delete
1. Log in as user A
2. Create property as user A and copy its ID
3. Log out
4. Log in as user B
5. Try to delete user A's property via API
6. Should get 403 error: "Only admin or listing owner can delete this property"

### Test Case 3: Admin Can Delete Any Property
1. Create user with `isAdmin = true` in DB
2. Log in as admin
3. See all properties in system
4. Delete any property
5. Successful deletion

## Troubleshooting

### "Unable to delete property" Error
- Check if you're logged in
- Check if property exists
- Check backend logs: `docker logs urbannest-backend`

### My Listings Not Showing
- Refresh page
- Check if logged in
- Verify email matches the property owner email

### Delete Button Not Appearing
- Ensure you created the property (owner match)
- Check browser console for errors
- Rebuild frontend: `npm run build`

## Future Enhancements

1. **Admin Dashboard** - View all properties and manage deletions
2. **Soft Delete** - Keep deleted listings in archive
3. **Delete Reason** - Reason for deletion (sold, inactive, etc.)
4. **Bulk Delete** - Delete multiple properties at once
5. **Delete History** - Audit log of deleted properties
6. **Restore** - Restore deleted properties (within 30 days)

## Security Notes

⚠️ **Important**: 
- Deletion is permanent (not reversible in current version)
- Only JWT token holders can delete
- Admin status is checked on every delete request
- No client-side authorization (security in backend)
