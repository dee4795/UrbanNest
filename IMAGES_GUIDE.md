# UrbanNest Property Images - Quick Reference

## Two Ways to Add Property Photos

### Method 1: Upload from Device (📤)
```
1. Click "📤 Upload from Device" tab
2. Select images from your computer
3. Images appear in preview grid
4. Submit with property details
```
**Best for:** Testing, quick uploads, small images

---

### Method 2: Provide Image URL (🔗)
```
1. Click "🔗 Add Image URL" tab
2. Paste HTTPS image URL
3. Click "Add URL" button
4. Preview appears in grid
5. Submit with property details
```
**Best for:** Production, CDN images, external hosting

---

## Valid Image Sources

✅ **Unsplash Images:**
- https://images.unsplash.com/photo-1234567890...

✅ **Imgur:**
- https://i.imgur.com/abcdefgh.jpg

✅ **AWS S3:**
- https://mybucket.s3.amazonaws.com/image.jpg

✅ **Google Cloud Storage:**
- https://storage.googleapis.com/bucket/image.jpg

✅ **Any CDN with HTTPS:**
- https://cdn.example.com/photo.jpg

---

## Important Rules

❌ **NOT Allowed:** HTTP (non-secure)
- ❌ http://example.com/image.jpg

✅ **MUST Use:** HTTPS (secure)
- ✅ https://example.com/image.jpg

---

## Backend API Example

```bash
# POST /api/listings (requires authentication)

curl -X POST http://localhost:3000/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "ownerEmail": "user@example.com",
    "purpose": "rent",
    "propertyType": "apartment",
    "title": "Beautiful 2BHK",
    "bhk": 2,
    "price": 50000,
    "address": "123 Main St",
    "contactName": "John",
    "contactPhone": "9876543210",
    "imageDataUrls": [
      "https://images.unsplash.com/photo-123456789",
      "https://cdn.example.com/apartment.jpg"
    ]
  }'
```

---

## Database Storage

Images are stored in PostgreSQL as an array of URL strings:

```sql
SELECT imageDataUrls FROM Listing WHERE id = 'xyz123';

-- Result:
[
  'https://images.unsplash.com/photo-1234567890',
  'https://cdn.example.com/apartment.jpg'
]
```

---

## Tips & Best Practices

1. **Use HTTPS URLs:** Always use secure (HTTPS) links
2. **Compress Images:** Use CDN-hosted images for better performance
3. **CDN Recommended:** For production, use cloud storage + CDN
4. **Limit Size:** Database has 3MB limit per listing
5. **Local Upload:** Use for testing, URLs for production

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| URL not accepted | Ensure it's HTTPS (not HTTP) |
| Image not showing | Check URL is accessible |
| Upload too slow | Use image URLs instead |
| Too many images | Split into multiple listings |

---

For more info, see README.md or check backend API docs.
