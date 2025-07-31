# MangaCompass Development Commands

## Essential Development Commands

### Development Server
```bash
npm run dev
```
Starts the Next.js development server on http://localhost:3000

### Building for Production
```bash
npm run build
```
Creates an optimized production build

### Running Production Server
```bash
npm run start
```
Starts the production server (requires build first)

### Code Quality
```bash
npm run lint
```
Runs ESLint to check code quality and style

## System Commands (Darwin/macOS)

### Git Operations
- `git status` - Check current git status
- `git add .` - Stage all changes
- `git commit -m "message"` - Commit changes
- `git push` - Push to remote repository

### File Navigation
- `ls -la` - List all files with details
- `cd directory` - Change directory
- `pwd` - Print working directory
- `find . -name "*.tsx"` - Find TypeScript React files

### File Operations
- `cat file` - Display file contents
- `grep -r "pattern" .` - Search for pattern in files
- `mkdir directory` - Create directory
- `rm file` - Remove file (use with caution)

### Process Management
- `ps aux | grep node` - Find Node.js processes
- `kill -9 PID` - Force kill process
- `lsof -i :3000` - Check what's using port 3000

## When Task is Completed

Always run these commands after making changes:
1. `npm run lint` - Ensure code meets quality standards
2. `npm run build` - Verify the build succeeds
3. Test all affected pages in the browser
4. Check mobile responsiveness
5. Verify affiliate links are working correctly