

https://github.com/user-attachments/assets/98ed892b-0ceb-4ef7-ac82-e3bc497f6a36

## Prerequisites

Before you begin setting up the project, ensure you have the following software installed on your machine:

  1. **Next.js**: This is essential for building your frontend with React. You can initialize a Next.js project using the following command:
  
  2. **Node.js**: This is required for running JavaScript on the server. You can download and install the latest version from the official Node.js website.
   
  3. **npm (Node Package Manager)**: npm is installed automatically with Node.js and is used to manage and install packages necessary for your project.
   
  4. **Git**: Git is used for version control. If you don’t have it installed, you can download it from the official Git website.
   
  5. **Solana actions**: If you're working with Solana, you may need Solana CLI tools. Follow the Solana documentation to install them.
   
  6. **MongoDB**: MongoDB must be installed according to your operating system. Follow the installation instructions from the official MongoDB website.


## Environment Configuration

Setting up the `.env` files is crucial for the project. These files store all the necessary environment variables required for the application to run, such as API keys and configuration settings. Follow these steps:


1. **Copy the Sample Environment Files**: The repository includes sample environment files named `.env.sample`. Copy these files to create your own `.env` files.

    ```sh
    cd minutes/ && cp .env.sample .env
    ```

2. **Edit the `.env` Files**: Open each `.env` file in a text editor and replace the placeholder values with your actual API keys and configuration settings. You may need to add multiple API keys depending on the services your project integrates with.


## Installation
Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/Pawank06/minutes.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd minutes
    ```
3. **Install dependencies**

   ```sh
    npm i
    ```
4. **Starting the server**

   ```sh
    npm run dev
    ```



