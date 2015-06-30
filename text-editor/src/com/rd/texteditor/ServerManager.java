package com.rd.texteditor;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;

public class ServerManager {
	
	private Server server;
	
	public ServerManager(int portNumber) throws Exception {
        server = new Server(portNumber);
        
        // The resource base indicates where the files should be served out of.
        ResourceHandler rh = new ResourceHandler();
        rh.setResourceBase("bin/frontend");
        rh.setDirectoriesListed(true);
        rh.setWelcomeFiles(new String[]{ "index.html" });

        ServletContextHandler ch = new ServletContextHandler();
        ch.setContextPath("/test");
        MainServlet mainServlet = new MainServlet();
        ch.addServlet(new ServletHolder(mainServlet), "/");
        
        HandlerList handlers = new HandlerList();
        handlers.setHandlers(new Handler[] { rh, ch });
        
        server.setHandler(handlers);
	}
	
	public void startServer() throws Exception {
		server.start();
		server.join();
	}
	
	public void stopServer() throws Exception {
		server.stop();
	}
	
	protected void finalize() throws Throwable {
		stopServer();
	}
}
