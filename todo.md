# Mobile App (farmers-app) - Issues & Improvements

## Tech Stack
- **Expo SDK 54** with Expo Router
- **Clerk** for auth (email/password + Google OAuth)
- **tRPC** for type-safe API calls
- **TanStack Query** for data fetching
- **NativeWind** (Tailwind for RN)

## Screens Overview
| Tab | Status | Description |
|-----|--------|-------------|
| Home | Working | Dashboard, tasks (API connected), weather (mock) |
| Fields | Working | Full CRUD, activity logging (API connected) |
| AI | Static | Fake chat UI, no functionality |
| Books | Working | Income/expense tracking (API connected) |
| Profile | Working | Real Clerk user data, generated farmer ID |

---

## UI Bugs (All Fixed)
- [x] **Profile screen** - Added `SafeAreaView` with proper edges
- [x] **Back button in Fields** - Changed to `ArrowLeft` icon
- [x] **space-y-\* classes** - Replaced with `gap-*` across all screens
- [x] **"See All" button** - Added `onSeeAll` prop with handler
- [x] **Quick Actions** - Added `onPress` handlers with alerts
- [x] **Sign-in errors** - Added error state and display

## Logic Bugs (All Fixed)
- [x] **Fields screen** - Now connected to `farmerFields` API with full CRUD
- [x] **Profile screen** - Uses real Clerk data (name, email, member since)
- [x] **Tasks** - Added completion toggle + delete functionality
- [x] **Activity log** - Connected to backend with `FieldActivity` model
- [x] **AI screen** - Connected to Groq API (Llama 3.1 8B) with chat persistence

## Database Schema Added
```prisma
- FarmerFields (userId, name, crop, variety, size, status, location, compliance, etc.)
- FieldActivity (fieldId, activityType, description, quantity, cost, etc.)
- ChatConversation (userId, title, messages)
- ChatMessage (conversationId, role, content)
- Enums: FieldStatus, ComplianceStatus, ActivityType, ChatRole
```

## API Routes Added (`farmerFields` router)
- `myFields` - Get all fields for current user
- `getById` - Get single field with activities
- `create` - Create new field
- `update` - Update field
- `delete` - Delete field (cascades to activities)
- `stats` - Get field statistics for dashboard
- `logActivity` - Log activity on a field
- `getActivities` - Get paginated activities
- `deleteActivity` - Delete an activity
- `recentActivities` - Get recent activities across all fields

## API Routes Added (`chat` router)
- `getConversations` - Get all conversations for user
- `getConversation` - Get single conversation with messages
- `createConversation` - Create new conversation
- `sendMessage` - Send message and get AI response (Groq)
- `deleteConversation` - Delete a conversation
- `clearHistory` - Clear all user conversations

---

## Missing Features (Prioritized)

### High Priority
- [ ] **GPS location capture** - Capture field coordinates on creation
- [ ] **Camera integration** - Photo evidence for activities
- [ ] **Offline support** - Queue operations when offline, sync when online
- [ ] **Push notifications** - Task reminders, weather alerts

### Medium Priority
- [x] **Weather API integration** - Real weather data (Open-Meteo API with location-based forecasts)
- [ ] **Task editing** - Edit existing tasks
- [ ] **QR code generation** - Real scannable QR with farmer ID
- [ ] **Profile editing** - Allow farmers to update their info
- [ ] **Field map visualization** - Show field boundaries on map

### Low Priority / Future
- [x] **AI chat assistant** - Farm advice, pest identification (Groq + Llama 3.1)
- [ ] **Export data** - PDF/CSV reports for compliance
- [ ] **Multi-language support** - Swahili, French for African markets
- [ ] **Voice input** - Log activities via voice
- [ ] **Harvest predictions** - Based on activity data

---

## Suggested New Features for Traceability

### Supply Chain Features
- [ ] **Harvest logging** - Record harvest quantity, quality grade, batch number
- [ ] **Buyer integration** - Connect with agribusiness buyers
- [ ] **Certification tracking** - EUDR, Rainforest Alliance, Organic status
- [ ] **Input batch tracking** - Link fertilizers/pesticides to specific batches

### Farmer Empowerment
- [ ] **Market prices** - Show current crop prices
- [ ] **Expense tracking** - Already done in Books, can expand
- [ ] **Yield analytics** - Compare yields across seasons
- [ ] **Community features** - Connect with nearby farmers

### Compliance & Audit
- [ ] **Audit trail export** - Generate traceability reports
- [ ] **Document upload** - Store certificates, receipts
- [ ] **Geo-verification** - Verify field is not in protected forest
- [ ] **Satellite imagery** - Field health monitoring (NDVI)

---

## Run Database Migration
After pulling these changes, run:
```bash
cd packages/db
npx prisma migrate dev --name add_farmer_fields
npx prisma generate
```
