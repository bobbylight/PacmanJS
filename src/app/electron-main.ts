import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

/*
 * Entry point for desktop version.  This is built with electron:
 * http://electron.atom.io/
 */
(() => {
    'use strict';

    // Keep a global reference of the window object, if you don't, the window will
    // be closed automatically when the JavaScript object is garbage collected.
    let mainWindow: Electron.BrowserWindow | null;

    const createWindow: (launchInfo: any) => void = (launchInfo: any): void => {
        // Create the browser window.
        mainWindow = new BrowserWindow({
            width: 224, height: 288,
            useContentSize: true,
            autoHideMenuBar: true
        });

        // and load the index.html of the app.
        mainWindow.loadURL(formatUrl({
            pathname: path.join(__dirname, 'desktop-index.html'),
            protocol: 'file',
            slashes: true
        }));

        // Open the DevTools.
        mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        mainWindow.on('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            mainWindow = null;
        });

        import('./pacman').then(() => {
            (window as any).init('parent');
        });
    };

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    app.on('ready', createWindow);

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow(null);
        }
    });

})();
