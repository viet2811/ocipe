## Update code
Use `dev` branch to update code locally with Docker compose

## After update
**DO NOT** merge dev to main 

Instead, run this code to get commit hash

```
git log dev --oneline
```

Then

```
git checkout main
git cherry-pick <commit-hash>
git commit
```

For range of commits

```
git cherry-pick <oldest-hash>^..<newest-hash>
```
