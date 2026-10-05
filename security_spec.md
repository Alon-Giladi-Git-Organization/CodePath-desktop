# Security Specification & Threat Model for CodePath

## Core Data Invariants
1. **User Profile Isolation**: Users can only read, write, and delete their own `/users/{userId}` profile document (`request.auth.uid == userId`).
2. **Identity Verification**: On creation and mutation of user profiles and leaderboard entries, `incoming().id == request.auth.uid` and `incoming().userId == request.auth.uid` must hold.
3. **Leaderboard Consistency**: A user can write to `/leaderboard/{userId}` only if `request.auth.uid == userId`.
4. **Leaderboard Visibility**: Public reads (`allow get, list`) are permitted on `/leaderboard` so learners can view rankings and compare progress.
5. **Immutable Identity**: `id` cannot be altered after creation.
6. **String & Array Bounding**: All string fields are bounded by length limits and arrays are bounded to prevent Denial-of-Wallet attacks.

## The Dirty Dozen Threat Payloads
1. **Unauthenticated Profile Read**: Anonymous user attempts `GET /users/victim-uid`. (Expect: PERMISSION_DENIED)
2. **Cross-User Profile Write**: Attacker authenticated as `attacker-uid` attempts `SET /users/victim-uid` with modified XP. (Expect: PERMISSION_DENIED)
3. **Ghost Field Poisoning**: Client attempts to inject `isAdmin: true` or `bypassed: true` into their own user profile. (Expect: PERMISSION_DENIED)
4. **Oversized String Bomb**: Client attempts to write a 2MB string into `name` or `email` of a profile. (Expect: PERMISSION_DENIED)
5. **Unbounded Array Flooding**: Client attempts to push 50,000 lesson IDs into `completedLessons`. (Expect: PERMISSION_DENIED)
6. **Cross-User Profile Update**: User B executes `UPDATE /users/UserA` changing XP or streak. (Expect: PERMISSION_DENIED)
7. **Leaderboard Impersonation**: Attacker authenticated as `attacker-uid` attempts to overwrite `/leaderboard/victim-uid`. (Expect: PERMISSION_DENIED)
8. **Negative XP Exploit**: Client submits profile with `xp: -9999` or `streak: -1`. (Expect: PERMISSION_DENIED)
9. **Path Variable ID Traversal**: Malicious request targets path `/users/../..//attack`. (Expect: PERMISSION_DENIED)
10. **Unauthenticated Leaderboard Write**: Unauthenticated user attempts `POST /leaderboard/guest1`. (Expect: PERMISSION_DENIED)
11. **Spoofed User ID in Payload**: User with UID `user-1` attempts to write document `/users/user-1` with payload `{ id: "user-2" }`. (Expect: PERMISSION_DENIED)
12. **Immutable ID Rewrite**: Client attempts to update document `/users/user-1` with `{ id: "other-id" }`. (Expect: PERMISSION_DENIED)
