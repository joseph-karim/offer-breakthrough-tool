# Workshop Session Cleanup Script

This script helps you identify and clean up duplicate workshop sessions in the Supabase database.

## What it does

1. Finds workshop sessions that were created within 5 seconds of each other for the same user
2. Identifies these as duplicates (keeping the newest one)
3. Allows you to review the duplicates before deletion
4. Deletes the duplicate sessions after confirmation

## Setup

1. Copy the files to a directory:
   - `cleanup-duplicate-sessions.js`
   - `cleanup-package.json` (rename to `package.json`)
   - `cleanup.env.example` (copy to `.env`)

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables:
   - Copy `cleanup.env.example` to `.env`
   - Fill in your Supabase URL and anon key

## Usage

Run the script:
```
npm run cleanup
```

The script will:
1. Display all duplicate sessions it finds
2. Ask for confirmation before deleting
3. Delete the duplicates if confirmed

## Safety Features

- The script only identifies sessions created within 5 seconds of each other as duplicates
- It always keeps the newest session in each duplicate group
- It requires manual confirmation before deleting anything
- It shows you exactly which sessions will be deleted before proceeding
