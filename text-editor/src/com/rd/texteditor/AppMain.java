package com.rd.texteditor;
 
public class AppMain {
	
    public static void main(String[] args) throws Exception {
    	ServerManager serverManager = new ServerManager(6820);
    	serverManager.startServer();
    }
}