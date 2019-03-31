package main;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IoSession;
/*此为client的handler
 * 目的为了让服务器发送过来的信息进行解释和处理
 * 统一放在messageReceive里处理
 * 但是也要根据前段需求来
 */
public class TimeClientHandler extends IoHandlerAdapter {
//handler
    public void messageReceived(IoSession session, Object message) throws Exception {
    		
    	 //利用下面写的函数，将buffer转化为string
		String content = message.toString();
		//打印收到的信息
    System.out.println("client receive a message is : " + content);
    
          //此处根据fastjson库确定传过来的字符串怎么处理变成json对象
       // JSONObject request = JSONObject.fromObject(message.toString());  
        // 根据传来的数据进行处理  
        //System.out.println(request);  
 
	
    }

    public void messageSent(IoSession session, Object message) throws Exception {
        System.out.println("ClientMessageSent -> ：" + message);
    }
    




//上面提到的buffer转string函数
public static String ioBufferToString(Object message)   
{   
      if (!(message instanceof IoBuffer))   
      {   
        return "";   
      }   
      IoBuffer ioBuffer = (IoBuffer) message;   
      byte[] b = new byte [ioBuffer.limit()];   
      ioBuffer.get(b);   
      StringBuffer stringBuffer = new StringBuffer();   
  
      for (int i = 0; i < b.length; i++)   
      {   
  
       stringBuffer.append((char) b [i]);   
      }   
       return stringBuffer.toString();   
}  

}