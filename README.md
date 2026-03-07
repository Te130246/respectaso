# 🛠️ respectaso - Simple ASO Keyword Research Tool

[![Download respectaso](https://img.shields.io/badge/Download-respectaso-brightgreen?style=for-the-badge)](https://github.com/Te130246/respectaso/releases)

---

## 📋 What is respectaso?

respectaso is a free and open-source tool to help you find keywords for app store optimization (ASO). It runs on your own computer using Docker, so no data leaves your machine. You do not need API keys or an account to use it. This means you keep control of your data while exploring keywords that can improve your app's presence in stores.

---

## 💻 System Requirements

Before getting started, make sure your computer meets these basic needs:

- Windows 10 or later (64-bit)
- At least 4 GB of free RAM
- 3 GB of available hard drive space
- Internet connection (for initial download and keyword lookup)
- Docker Desktop installed and running (see next section)

---

## 🐳 Installing Docker Desktop on Windows

respectaso runs inside Docker. Docker lets software run safely inside containers. This setup keeps respectaso isolated from the rest of your computer.

1. Visit the Docker Desktop page: https://www.docker.com/products/docker-desktop
2. Click **Download for Windows (Windows 10/11)**.
3. Run the downloaded file and follow all prompts.
4. After installation, Docker may ask you to sign in or create an account. This is optional for using respectaso.
5. Restart your computer if the installer asks you to.
6. Once Docker is running, look for the whale icon in your system tray (bottom right corner). It means Docker is ready.

---

## 🚀 Downloading and Running respectaso

1. Visit the respectaso releases page:  
   [**Download respectaso here**](https://github.com/Te130246/respectaso/releases)

2. On this page, locate the latest release. It will usually be at the top.

3. Download the Windows version file. This will be labeled clearly, often with `.exe` or `.zip`.

4. If you download a `.zip` file, right-click it and select **Extract All...** then choose a folder to extract.

5. Open the folder containing the extracted files.

6. Locate the file named something like `run_respectaso.bat` or `start_respectaso.bat`. This is the file that starts respectaso inside Docker.

7. Double-click the batch file. A command window will open. This will pull and start the respectaso Docker container.

8. Wait for the messages in the window to stop changing. It may take a few minutes the first time.

9. Once running, the command window will show "respectaso running" or similar.

---

## 🌐 Accessing respectaso in Your Browser

After the program starts:

1. Open a web browser (Chrome, Edge, Firefox).
2. Enter this address in the address bar: `http://localhost:3000`
3. Press Enter.
4. You should see the respectaso web interface.
5. Use the interface to start searching for ASO keywords.

---

## ⚙️ Basic Usage Tips

- Type app or game names into the search box to get keyword ideas.
- Results appear quickly and show related terms.
- Use the filters as needed to narrow down your keyword list.
- Export your keyword lists for use in app store descriptions and campaigns.
- You can run respectaso anytime by starting the batch file again.

---

## 🛠️ Troubleshooting Common Issues

- **Docker not running:** Make sure Docker Desktop is open. Look for its whale icon.
- **Batch file does nothing or closes immediately:** Right-click the batch file and choose **Run as administrator**.
- **Cannot access `localhost:3000`:** Check that no other program uses that port. Restart Docker and the batch file.
- **Slow startup:** First time pulls the Docker image, which may take several minutes on a slow internet connection.
- **Windows Defender or antivirus blocking:** Allow the app or create an exception for Docker and respectaso files.

---

## 📁 File Structure Overview

After you extract and download respectaso, files may include:

- `run_respectaso.bat` - Starts the respectaso Docker container.
- `README.md` - This file with instructions.
- `config` folder - Optional folder for advanced users to tweak settings.
- `data` folder - Stores search results and data created during use.

Do not delete or move important files unless you know what you are doing.

---

## 🔄 Updating respectaso

To update the tool to the latest version:

1. Stop respectaso by closing the command window running the batch file.
2. Visit the releases page again:  
   [**Download last version here**](https://github.com/Te130246/respectaso/releases)
3. Download and replace the old files with the new ones.
4. Run the batch file to start the updated version.

---

## 📞 Getting Help

For help and questions, check the discussions or issues tab on the GitHub page:  
https://github.com/Te130246/respectaso/issues

You can also search online for basic Docker questions or Windows command line help.

---

[![Download respectaso](https://img.shields.io/badge/Download-respectaso-blue?style=for-the-badge)](https://github.com/Te130246/respectaso/releases)