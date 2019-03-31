package main;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.UnknownHostException;
import java.nio.charset.Charset;
import java.sql.SQLException;

import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.filter.codec.ProtocolCodecFilter;
import org.apache.mina.filter.codec.textline.LineDelimiter;
import org.apache.mina.filter.codec.textline.TextLineCodecFactory;
import org.apache.mina.filter.logging.LogLevel;
import org.apache.mina.filter.logging.LoggingFilter;
import org.apache.mina.transport.socket.SocketAcceptor;
import org.apache.mina.transport.socket.nio.NioSocketAcceptor;

import dbservice.Base64coder;
import dbservice.Database;
import filter.MinaDecoder;
import filter.MinaEncoder;
import view.IUpdateViewFactory;

public class ListenForever {
    
    SocketAcceptor acceptor = null;
    Database instance = Database.getDatabaseInstance();
    ListenForever(){
    	
    	new Thread() {
    		public void run() {
    			try {
    	            ServerSocket ss=new ServerSocket(9999);

    	            while(true){
    	                Socket socket=ss.accept();
    	                BufferedReader bd=new BufferedReader(new InputStreamReader(socket.getInputStream()));
    	                
    	                /**
    	                 * 接受HTTP请求
    	                 */
    	                String requestHeader;
    	                int contentLength=0;
    	                while((requestHeader=bd.readLine())!=null&&!requestHeader.isEmpty()){
    	                    System.out.println(requestHeader);
    	                    /**
    	                     * 获得GET参数
    	                     */
    	                    if(requestHeader.startsWith("GET")){
    	                        int begin = requestHeader.indexOf("/?")+2;
    	                        int end = requestHeader.indexOf("HTTP/");
    	                        String condition=requestHeader.substring(begin, end);
    	                        System.out.println("GET参数是："+condition);
    	                    }
    	                    /**
    	                     * 获得POST参数
    	                     * 1.获取请求内容长度
    	                     */
    	                    if(requestHeader.startsWith("Content-Length")){
    	                        int begin=requestHeader.indexOf("Content-Lengh: ")+"Content-Length:".length();
    	                        String postParamterLength=requestHeader.substring(begin).trim();
    	                        String postParameterLength=postParamterLength.substring(2,postParamterLength.length());
    	                        contentLength=Integer.parseInt(postParameterLength);
    	                        System.out.println("POST参数长度是："+Integer.parseInt(postParameterLength));
    	                    }
    	                }
    	                StringBuffer sb=new StringBuffer();
    	                if(contentLength>0){
    	                    for (int i = 0; i < contentLength; i++) {
    	                        sb.append((char)bd.read());
    	                    }
    	                    String total=sb.toString();
    	                    System.out.println("POST参数是：");
    	                    String[] base64s=total.split("NMSLNMSLNMSL");
    	                    String imgName=base64s[1];
    	                    String base64=base64s[2];
    	                    IUpdateViewFactory.getUpdateView().log(
    	            				"[imageServerReceived] " + "imageName="+imgName);
    	                    //String test=
    	                    //Base64coder.ImageToBase64ByLocal("C:/Program Files/xml_course_3_26/nmsl/1.png");
    	                    //Base64coder.Base64ToImage(test,"C:/Program Files/xml_course_3_26/nmsl/3.jpg");
    	                    //System.out.println(test);
    	                    //IUpdateViewFactory.getUpdateView().log(
    	            				//"[imageServerReceived] " + "test="+test);
    	                    //System.out.println(imgName);
    	                    //System.out.println(base64);
    	                    //IUpdateViewFactory.getUpdateView().log(
    	            				//"[imageServerReceived] " + "base64="+base64);
    	                    String base642=base64.substring(23,base64.length());
    	                    //System.out.println(base642);
    	                    //IUpdateViewFactory.getUpdateView().log(
    	            				//"[imageServerReceived] " + "base642="+base642);
    	                    Base64coder.Base64ToImage(base642,"C:/Program Files/xml_course_3_26/nmsl/"+imgName+".jpg");
    	                    if(imgName.length()==6)
    	                    	instance.setTableInfo("item","itemid",imgName,"picture","http://47.102.141.201:8080/raptorXML/nmsl/"+imgName+".jpg");
    	                    else {
    	                    	instance.setTableInfo("user","userid",imgName,"avatar","http://47.102.141.201:8080/raptorXML/nmsl/"+imgName+".jpg");
    	                    }
    	                }
    	                //发送回执
    	                PrintWriter pw=new PrintWriter(socket.getOutputStream());
    	                
    	                pw.println("HTTP/1.1 200 OK");
    	                pw.println("Content-type:text/html");
    	                pw.println();
    	                pw.println("<h1>访问成功！</h1>");
    	                
    	                pw.flush();
    	                socket.close();
    	            }
    	        } catch (Exception e) {
    	            e.printStackTrace();
    	        } 
    		}
    	}.start();
    	
        acceptor = new NioSocketAcceptor();
        acceptor.getFilterChain().addLast("coder",
				new ProtocolCodecFilter(new MinaEncoder(), new MinaDecoder()));
        if(!bind()){
            System.out.println("服务器启动失败");
        }else{
            System.out.println("服务器启动成功");
        }
    }
    public boolean bind(){
        //acceptor.getFilterChain().addLast("codec", new ProtocolCodecFilter(
                //new MyTextLineCodecFactory()); //閰嶇疆CodecFactory
        LoggingFilter log = new LoggingFilter();
        log.setMessageReceivedLogLevel(LogLevel.INFO);
        acceptor.getFilterChain().addLast("logger", log);
        acceptor.setHandler(new ServerHandler());//閰嶇疆handler
        acceptor.getSessionConfig().setReadBufferSize(2048);
		acceptor.getSessionConfig().setIdleTime(IdleStatus.READER_IDLE,
				60 * 60 * 2);
        try {
            acceptor.bind(new InetSocketAddress(8899));
            return true;
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return false;
        }
        
    }
    /*
    public static void main(String args[]){
        ListenForever server = new ListenForever();
        if(!server.bind()){
            System.out.println("鏈嶅姟鍣ㄥ惎鍔ㄥけ璐�");
        }else{
            System.out.println("鏈嶅姟鍣ㄥ惎鍔ㄦ垚鍔�");
        }
    }*/

}