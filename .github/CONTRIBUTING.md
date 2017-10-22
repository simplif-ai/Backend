# Contributing to Simplif.ai
 - [Pull Request Guidelines](#pull-request-guidelines)
 - [Commit Message Format](#commit-message-format)
 - [Issue Report Guidelines](#issue-report-guidelines) 
 
 
## Pull Request Guidelines

### Format

- Title: General Description of what the Pull Request is doing
- Description: Follow the preloaded Template

### General Instructions

- Before creating a Pull Request make sure to merge the ```develop``` branch into your branch to resolve merge conflicts.
- When creating a Pull Request make sure to fill out the Pull Request Template that gets preloaded into the description of the Pull Request.
- When your Pull Request is ready for review then make sure to add at least one reviewer.
- Before merging your Pull Request make sure that at least one reviewer has looked over the code and approved the Pull Request with a comment that says "Looks good to me".
- Before merging your Pull Request make sure to resolve all discussions.
- You are in charge of merging your own Pull Request.
- Once you merge the Pull Request delete the branch that you made the Pull Request on.

### Labeling Your Pull Requests

- If your Pull Request is to fix a bug then be sure to add the `bug` label.
- If you are done coding for that Pull Request then be sure add the `ready for review` label.

### Work In Progress Pull Requests

If you are stuck and need some help and want someone to look over your code then make a Work In Progress Pull Request.  The format for the WIP Pull Requests is as follows:

- The title of the Pull Request should be ```[wip]<Title of Pull Request>```
- Make sure to have the brackets around wip because this will create a WIP Pull Request and prevent it from being merged.

To resolve a WIP Pull Request to merge it just remove `[wip]` from the title and then you will be able to merge the Pull Request.

#### Example Pull Request

```git
Setup File Structure and add Templates
<Follow Template>
```

### Branching

- Create a new branch for every feature that you implement.  Make sure to name it something relevant to the feature.
- When creating a new branch make sure to branch off of the ```develop``` branch. 
- At the end of each Sprint we will make a release to the ```master``` branch from the ```develop``` branch.

*Note: You are unable to push to the master branch.  The develop branch will be set as the default branch and you will also be unable to push to it.*

## Commit Message Format
Each commit message consists of a Title and a Description.  The Title of the commit needs to explain the result of the commit.  The Description of the commit needs to explain the purpose of the commit.

### Making a Commit online through Github
If you are making a commit through the Github GUI then follow the format for the Title and Description and making sure to put them in their correct respective locations.

### Making a Commit through Git CLI
The format for making a commit through the GIT CLI is as follows:

```bash
git commit -m "<Content for Title>" -m "<Content for Description>"
```

### Revert
If you need to revert a commit then change the Commit Message Format as follows
 - The title should have the format ```revert: <title of commit being reverted>```.
 - The description should have the format ```This reverts to the commit <title of commit reverting to> <hash of the respective commit>```.

#### Example Commit
```bash
git commit -m "Input form does not crash" -m "Restricted input to just numeric symbols instead of alphanumeric"
```


## Issue Report Guidelines

### Issues

- When naming the Issue make sure to name it something relevant to what the Issue is.
- For the body of the Issue fill out the preloaded template.
- If the Issue is a bug then add the `bug` label.
- If the Issue is not a bug then add the `issue` label.

#### Example Issue Report
```
Users not finding Logout Button
<Follow Template>
```

#### Example Bug Report
```
Login button does not open a Login prompt
<Follow Template>
```

### User Stories

- When creating the user story title follow the format ```User Story - <Brief Description> (#<User Story Number>)```
- When creating the user story add the ```user story``` label
- For the description of the user story follow the template for the user story description.  The template can be found retrieved by clicking on the file ```Templates/USER_STORY_TEMPLATE.md``` and then clicking on the
 ```raw``` button at the top right of the preview pane.
 
#### Example User Story

```
User Story - Documentation (#39)
<Follow Template>
```
