# XP-System Documentation
Before learning how to use this software. Be sure to set up the site by reading `README.md`.
Once you have completed the setup and are ready to use the software follow theses steps:


### Table of Contents
1. [How it Works](#How-it-works)
2. [Making a site Admin](#Setting-up-site-Admin)
3. [Registering a Teacher](#Register-a-Teacher)
4. [Registering a Student](#Register-a-Student)
5. [Creating Courses](#Creating-a-course)
6. [Creating Assignments](#Creating-an-assignment)
7. [Giving a Student XP](#Giving-XP)
8. [Editing Accounts](#Editing-accounts)
9. [Deleting Users](#Deleting-users)
10. [Viewing Assignments](#Viewing-assignments)
11. [Logging In](#Logging-in)
12. [List of ranks](#Ranks)

### Ranks
Ranks are a name you get based on your XP (Only for students).
Gaining more XP will get you higher ranks.

List of Ranks and XP value:
1. Digital Noob: 0 XP,
2. Digital Novice: 48 XP,
3. Digital Novice II: 100 XP,
4. Digital Amature: 148 XP,
5. Digital Amature II: 200 XP,
6. Digital Apprentice: 248 XP,
7. Digital Apprentice II: 300 XP,
8. Digital Journeyman: 396 XP,
9. Digital Journeyman II: 476 XP,
10. Digital Journeyman III: 532 XP,
11. Digital Crafter: 580 XP,
12. Expert Digital Crafter: 648 XP,
13. Master Digital Crafter: 800 XP

### Logging in
To login as a teacher, student or site Admin. Simply go to the main page and click the `Login` button.
Enter your email and your password for your account and you will be redirected to your accounts respected Dashboard. (Student, Teacher or Admin Dashboard).

### How it works
The XP-System is a school project for students to register and login to view quests (assignments) from any class they like. Completing quests, a Teacher can see how well you did and give you a respected amount of XP. Gaining XP is your goal. The amount of XP you have will dictate your rank. You can use these ranks to compare with friends are as a general point of your progress.

### Viewing assignments
When a student wishes to view an assignment, they aren't restricted to any class or a assignment.
A student can log in and in the middle of the page view classes/assignments.

1. Log in as student.
2. In the middle of the page. Use the dropdown list to select a class.
3. Selecting a class will give you all the assignments for that class.
4. Select the quest you would like to view. This will redirect you to a page with all the quest details.
5. When done with the assignment. Simple click the `Back to Dashboard` button and you'll be back to your dashboard.  

Note:
Students aren't restricted to any specific class or quest. This means they can go at their own pace selecting the assignments they want to do. They can also check out other classes and see their assignments to get an idea or reference to other things.

### Deleting users
Deleting a user can only be done by a site Admin.
Follow these steps:

1. Login to your admin account.
2. Find the user you would like to delete in the list next to the main panel to the left.
3. At the bottom of all account information for the selected user. There is a `Delete` button.
4. Clicking the delete button will bring a popup warning verifying you would like to delete this user.
5. Clicking the `Yes, Delete this user` button will delete the user entirely from the database.

Note: Be careful

### Editing accounts
In any account (Student or Teacher) on the main panel to the left. Will be an `Edit` button.
Click this button to edit the users name, password, or image.

1. Click the `Edit` button to be redirected to the edit page.
2. Fill in the information you would like to change. If you wish to not change some information, leave it blank and it won't change those details.
3. Click the `Save Changes` button and your account details will be updated.

### Giving XP
To give Experience to a student, make sure you have a [Teacher Registered](#Register-a-Teacher).
Follow these steps:

1. Login as Teacher
2. Look through the list of registered students next to the main panel on the left.
3. Click on the name of the student you would like to give XP to.
4. Click the `Add XP` button at the bottom of the Student information.
5. A popup will appear and prompt you for the amount of XP you would like to add.
6. After entering the amount of XP (0 to 50), click `Add XP`.

Done, the student will receive their XP and their details will be updated (XP and Rank)

### Creating an assignment
To create an assignment, make sure there is an [existing class](#Creating-a-course)
1. Login to your [Teacher account](#Register-a-Teacher)
2. In the main panel in the top left, click `New Quest`.
3. Fill in the assignment details.
4. Link your Quest to an existing class.
5. Click the `Create Quest` button and done.

### Creating a course
To create a course, make sure you have a [Teacher Registered](#Register-a-Teacher).
Login to your Teacher account and follow these steps:

1. Login as Teacher.
2. In the main panel in the top left, click `New Class`.
3. Fill in the Class information.
4. Click the `Create Class` button and done.

Note:
Once a class is created, Students can view the class and all assignments related to the class. Even if the class has no assignments.

### Register a Teacher
The site needs a Teacher for managing classes/assignments within those classes.
To create a Teacher:

1. Have your site Admin login
2. To the right of the page is the main panel. Click the `Create Teacher` button.
3. Enter in the credentials for the teacher.
4. Click the register teacher button and done.

After these steps. From any computer able to access the site. Can log in as a teacher with the provided credentials.

Note:
Teachers can edit their passwords/names after being registered.
Teachers can [Create Courses](#creating-a-course).
Teachers can [Create Assignments](#creating-an-assignment).
Teachers can view all registered students and their name, email, picture, and progress/rank.
Not selecting an image will give you the default profile picture image.

### Register a Student
Registering students are much simpler.

1. Simply visit the main `login/register` page.
2. And click the register button.
This will send the user (Student) to a account registration page.
3. Enter the credentials they desire and they are registered.

Notes:
A profanity filter prevents students and teachers from using profanity in their names and passwords upon account registration.
Students can view Courses and related assignments.
Students have the ability to edit their name, picture, or password.
Not selecting an image will give you the default profile picture image.

### Setting up site Admin
There is no default site admin so you will need to set one up.
To set up a site Admin:

1. You'll need to create the site admin in the database in a collection called users,
and insert a document via MongoDB Compass. Format the document as shown:
`{
  "role": "Admin",
  "name": your name,
  "email": your email,
  "password": your encrypted password
 }`

2. Replace `your name` with the name you specify, `your email` with the email you would like to use to  login, and replace `your encrypted password` with your [Encrypted Password](#Encrypting-Your-Password)

The ID for your admin document should be auto generated by MongoDB Compass when you `insert` the document.

It's that easy! Now that the site Admin has been created the software is ready to use.

Notes:
Site admins can delete any user (Student or Teacher).
Site admins can see all users (Student or Teacher) and information except passwords.
Site admins can create Teacher accounts.

### Encrypting Your Password
1. To encrypt your password while creating the admin account. Go into the `config` folder,
1. follow the instructions in encrypt.js and run encrypt.js via node `node encrypt.js`
