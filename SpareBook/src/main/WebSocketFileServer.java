package main;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import view.IUpdateViewFactory;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.UnknownHostException;
import java.nio.ByteBuffer;
import java.nio.channels.ByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.EnumSet;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

/**
 * Created by jeremy on 16/6/11.
 */
public class WebSocketFileServer extends WebSocketServer {

    private ConcurrentMap<WebSocket, ByteChannel> clients = new ConcurrentHashMap<WebSocket, ByteChannel>();

    public WebSocketFileServer(int port) throws UnknownHostException {
        super(new InetSocketAddress(port));
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println("One connection established: "+webSocket.toString());
    }

    @Override
    public void onMessage(WebSocket webSocket, String s) {
    	IUpdateViewFactory.getUpdateView().log(
				"FILE!!!!!![messageReceived] " + s.toString());
    	System.out.println("Recieve request: "+s);
		try {
			if(s.equals("It's end.")) {
				clients.get(webSocket).close();
				webSocket.close();
			}else {
        		Path target = Paths.get("C:/img/"+s);
                if(!Files.exists(target))
                    Files.createFile(target);
            	clients.put(webSocket, Files.newByteChannel(target, EnumSet.of(StandardOpenOption.WRITE)));
                webSocket.send("Let's continue.");
    		}
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onMessage(WebSocket conn, ByteBuffer message) {
    	System.out.println("Trying to build: "+clients.get(conn));
        try {
			clients.get(conn).write(message);
			
			conn.send("Let's continue.");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}      
    }

    @Override
    public void onError(WebSocket webSocket, Exception e) {
    	System.out.println("Something wrong because of the recieving of exception.");
    }

    public static void main(String[] args) throws UnknownHostException, InterruptedException {
        WebSocketFileServer s = new WebSocketFileServer( 8888 );
        s.start();
        System.out.println( "FileServer started on port: " + s.getPort() );
        Thread.sleep(Long.MAX_VALUE);
    }

	@Override
	public void onStart() {
		// TODO Auto-generated method stub
		System.out.println("Server get started.");
	}

	@Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        clients.remove(webSocket);
        System.out.println("One WebSocket ends: "+webSocket.toString());
    }
}