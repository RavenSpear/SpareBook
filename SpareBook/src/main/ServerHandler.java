package main;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.apache.mina.core.buffer.IoBuffer;
import org.apache.mina.core.service.IoHandlerAdapter;
import org.apache.mina.core.session.IdleStatus;
import org.apache.mina.core.session.IoSession;
import com.alibaba.fastjson.*;
import com.alibaba.fastjson.JSON;

import dbservice.Base64coder;
import dbservice.Database;
import filter.MinaBean;
import utils.WebSocketUtil;
import view.IUpdateViewFactory;

/**
 * 服务器端业务逻辑
 */
@SuppressWarnings({ "unused"})
public class ServerHandler extends IoHandlerAdapter {
	Database instance = Database.getDatabaseInstance();
	/**
	 * 连接创建事件
	 */
	@Override
	public void sessionCreated(IoSession session) {
		// 显示客户端的ip和端口
		System.out.println(session.getRemoteAddress().toString());
		IUpdateViewFactory.getUpdateView().updateLineNumber(
				session.getService().getManagedSessionCount());
	}
	@Override
	// 异常抓取并反馈
	public void exceptionCaught(IoSession session, Throwable cause) throws Exception {
		cause.printStackTrace();
	}
	/**
	 * 消息接收事件
	 */
	@Override
	// 收到消息后，自动调用此方法
	public void messageReceived(IoSession session, Object message) throws Exception {
		// 处理收到信息
		// 利用下面写的函数，将buffer转化为string
		//String content = ioBufferToString(message);
		// 打印收到的信息
		//System.out.println("server receive a message is : " + message);

		/*
		 * 此处根据fastjson库确定传过来的字符串怎么处理变成json对象 JSONObject request =
		 * JSONObject.fromObject(message.toString()); 根据传来的数据进行处理
		 * System.out.println(request);
		 */
		//String content =message.toString();
		IUpdateViewFactory.getUpdateView().log(
				"[messageReceived] " + message.toString());
		MinaBean minaBean = (MinaBean) message;
		MinaBean sendMessage = minaBean;
		if (minaBean.isWebAccept()) {
			sendMessage.setContent(WebSocketUtil.getSecWebSocketAccept(minaBean
					.getContent()));
			session.write(sendMessage);
			//System.out.println(minaBean.getContent());
			//MinaBean ok=new MinaBean("okkkkk");
			//session.write(ok);
		} /*else {
			Collection<IoSession> ioSessionSet = session.getService()
					.getManagedSessions().values();
			for (IoSession is : ioSessionSet) {
				is.write(message);
			}
		/*
		 * 服务器逻辑核心 用传过来的type转化为int型来判断客户端请求 通过switch语句来实现对不同请求的不同处理
		 * 每个case中都调用本.java中的private私有函数来处理请求 逻辑正式运算以及数据库接口的使用全部在private方法中
		 */
		String content=EOSDecoder(minaBean.getContent());
		System.out.println("iiii"+content);
		JSONObject typeOb = JSON.parseObject(content);
		String typeStr = typeOb.getString("type");
		int typeInt = Integer.parseInt(typeStr);;
		//此处已经转为int
		switch (typeInt) {
			case 99: {
			// Splash
				Splash(session,content);
			}
			break;
			case 100: {
			// 100type对应的请求，调用何种private
			// 注册
				signIn(session,content);
			}
			break;
			case 101: {
			// 101type对应的请求，调用何种private
			// 登录
			//将session加入session管理器！！
				signUp(session,content);
			}
			break;
			case 102: {
			// 102type对应的请求，调用何种private
			// 查询个人信息
				returnAssignByBuyer(session,content);
			}
			break;
			case 1021: {
				// 102type对应的请求，调用何种private
				// 查询个人信息
					returnBySeller(session,content);
				}
				break;
			case 1022: {
				// 102type对应的请求，调用何种private
				// 查询个人信息
					returnDone(session,content);
				}
				break;
			case 103: {
			//发布新商品
				newItem(session,content);
			}
			break;
			
			case 105:{
			/*
			 * 查询所有商品
			 */
				queryAll(session,content);
			}
			break;
			
			
			case 106:{
			/*
			 * keep matching
			 * 每次查询信息动态匹配返回
			 */
				sellerCancel(session,content);
			}
			break;
			
			
			
			case 114:{
			/*
			 * 买家取消交易
			 */
				buyerCancel(session,content);
			}
			break;
			case 115:{
			/*
			 * 关键字检索
			 */
				keywordSearch(session,content);
			}
			break;
			case 116:{
			/*
			 * 商品提供方结束交易
			 */
				endTrade(session,content);
			}
			break;
			
			case 119:{
				/*
				 * 查询Fetcher
				 *  wanted信息
				 */
					book(session,content);
				}
				break;
			case 120:{
				/*
				 * 查询个人信息
				 */
					getUserInfo(session,content);
				}
				break;
			case 121:{
				/*
				 * 修改个人信息
				 */
					setUserInfo(session,content);
				}
				break;
			default: {
			// default语句，返回false
				session.write(new MinaBean("{\"type\":999,\"state\":1}"));
			// 应该是json的false格式，以后再改
			}
		}
	}
	@Override
	// 获取等待间隔数
	// 客户端无请求时+1
	public void sessionIdle(IoSession session, IdleStatus status) throws Exception {
		System.out.println("IDLE" + session.getIdleCount(status));
	}
	// 向客户端发送信息
	public void messageSent(IoSession session, Object message) throws Exception {
		// 依然是监听发送后的响应，但是发送操作不在这里执行
		// 发送操作应该在接下来的函数中，根据客户端请求发送
		// 根据需求，服务器从不主动发送信息
		// 所有情况均为响应客户端要求
		System.out.println("ServerMessageSent -> ：" + message);
		// 此方法暂时为接口，日后会用到
		IUpdateViewFactory.getUpdateView().log(
				"[messageSent] [" + session.getRemoteAddress() + "] "
						+ message.toString());
	}
	public void sessionClosed(IoSession session) throws Exception {
        super.sessionClosed(session);
        System.out.println("session closed ");
        SessionManager.getManager().remove(session);
        IUpdateViewFactory.getUpdateView().updateLineNumber(
				session.getService().getManagedSessionCount());
    }
	/*
	 * 从此往下的这一部分是工具函数
	 * 1.buffer转string
	 * 2.数据库读取数据加报头
	 * 3.数据库读取数据加报尾
	 * 4.报头报尾合并
	 */
	// 1.buffer转string函数
	public static String ioBufferToString(Object message) {
		if (!(message instanceof IoBuffer)) {
			return "";
		}
		IoBuffer ioBuffer = (IoBuffer) message;
		byte[] b = new byte[ioBuffer.limit()];
		ioBuffer.get(b);
		StringBuffer stringBuffer = new StringBuffer();

		for (int i = 0; i < b.length; i++) {

			stringBuffer.append((char) b[i]);
		}
		return stringBuffer.toString();
	}
	//2.加报头
	public String addHead(String type,String message) {
		String head="{\"type\":"+type+",\"state\":0,\"data\":";
		return head+message;
	}
	//3.加报尾
	public String addTail(String message) {
		//直接返回加“}”
		return message+"}";
	}
	//4.报头报尾合并
	public String addHeadTail(String type,String message) {
		return
				addTail(addHead(type,message));
	}
	//5.解码
	public String EOSDecoder(String input) {
		return input.split("EOS")[0];
	}
	// private方法如下：
	// 注册                                              //ok
	private void signIn(IoSession session, String content) throws Exception {
		JSONObject messageObj = JSON.parseObject(content);
		String data = messageObj.getString("data");
		JSONObject userNameObj=JSON.parseObject(data);
		String UserName=userNameObj.getString("UserName");
		
		try {
			if(!(instance.IsExist("user", "username", UserName))) {
				instance.insertTableInfo("user", data);
				instance.setTableInfo("user", "username", UserName, "avatar", "http://47.102.141.201:8080/raptorXML/nmsl/100.jpg");
				String userid=instance.getTableInfo("user", "username", UserName, "userid");
				JSONObject idObj=JSON.parseObject(userid);
				int idStr=idObj.getIntValue("userid");
				session.write(new MinaBean("{\"type\":100,\"state\":0,\"userid\":"+idStr+"}"));
			}else {
				session.write(new MinaBean("{\"type\":100,\"state\":2,\"data\":\"UserName has been used\"}"));
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":100,\"state\":1}"));
			return;
		}
	}	
	// 登录验证                                          //ok
	private void signUp(IoSession session, String content) throws Exception {
		JSONObject info = JSON.parseObject(content);
		String dataStr=info.getString("data");
		JSONObject data = JSON.parseObject(dataStr);
		String UserID = data.getString("UserName");
		String psw = data.getString("Psw");
		try {
			String actually = instance.getTableInfo("user", "UserName", UserID, "Psw");
			JSONObject actuallyObj = JSONObject.parseObject(actually);
			if ((actuallyObj.getString("Psw")).equals(psw)) {
				String id=instance.getTableInfo("user", "UserName", UserID, "UserID");
				JSONObject idObj=JSON.parseObject(id);
				String idStr=idObj.getString("UserID");
				String message="{\"type\":101,\"state\":0,\"data\":"
								+instance.getTableInfo("user", "UserName", UserID)+							
								"}";
				session.write(new MinaBean(message));
						//session.write(new MinaBean("{type:101,\"state\":1}"));
						/*
						 * 在登录时将session保存加入静态session管理器
						 * 断网重连每次都登录
						 * 检测是否已经从管理器中删除
						 * 未删除的将原有删除加入新session
						 * 已删除的直接加入新session
						 * session是hashMap
						 * 键值对为  UserId：session
						 * 通过UserId查询对应session
						 * 通过已经保存的session来给客户端传递信息
						 */
						
				SessionManager.getManager().add(UserID,session);
						
						/*
						 * 判断是否有被接订单
						 * 提醒
						 * 格式191
						 */
						
						
						/*
						 * delete it for while
						 
						String arrayStr=instance.getTableInfo("wantid", "BbID", UserID);
						JSONArray arrayArr=JSON.parseArray(arrayStr);
						for(int i=0;i<arrayArr.size();i++) {
							String Str=arrayArr.getString(i);
							JSONObject Obj=JSON.parseObject(Str);
							int state=Obj.getIntValue("state");
							if(state==1) {
								session.write(addHeadTail("191",""));
								instance.setTableInfo("WantInfo", "WantID", Obj.get("WantID"), "state", "0");
								/*
								 * need to confirm with database!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
								 
							}
					*/
							
						
						
						// 这里应该是true的json格式，以后再改
					}else {
						session.write(new MinaBean("{\"type\":101,\"state\":1}"));
						// 同理，应该是json的false格式，以后再改
					}
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					session.write(new MinaBean("{\"type\":101,\"state\":1}"));
					return;
				}
				return;
			}
	// 用户作为买家查询已预定                           //102
	private void returnAssignByBuyer(IoSession session, String content)  {
		// message 转string
		
		// json方法
		JSONObject info = JSON.parseObject(content);
		// json中传来的应该是用户id，所以
		String dataStr=info.getString("data");
		JSONObject data = JSON.parseObject(dataStr);
		String UserId = data.getString("userid");
		//String State = data.getString("state");
		try {
			String itemsInfo = instance.getTableInfo("Item","buyerid="+UserId+" AND state=1");
			String head="{\"type\":"+"102"+",\"state\":0,\"data\":{";
			itemsInfo=head+"\"ItemInfoList\":"+itemsInfo;
			itemsInfo=itemsInfo+"}}";
			session.write(new MinaBean(itemsInfo));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":102,\"state\":1}"));
			return;
		}

	}
	//1021 查询发布的所有
	private void returnBySeller(IoSession session, String content)  {
		// message 转string
		
		// json方法
		JSONObject info = JSON.parseObject(content);
		// json中传来的应该是用户id，所以
		String dataStr=info.getString("data");
		JSONObject data = JSON.parseObject(dataStr);
		String UserId = data.getString("userid");
		//String State = data.getString("state");
		try {
			String itemsInfo = instance.getTableInfo("Item","sellerid="+UserId+" AND (state=1 OR state=0)");
			String head="{\"type\":"+"1021"+",\"state\":0,\"data\":{";
			itemsInfo=head+"\"ItemInfoList\":"+itemsInfo;
			itemsInfo=itemsInfo+"}}";
			session.write(new MinaBean(itemsInfo));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":1021,\"state\":1}"));
			return;
		}

	}
	//1022 查询成交的所有
	private void returnDone(IoSession session, String content)  {
			// message 转string
			
			// json方法
			JSONObject info = JSON.parseObject(content);
			// json中传来的应该是用户id，所以
			String dataStr=info.getString("data");
			JSONObject data = JSON.parseObject(dataStr);
			String UserId = data.getString("userid");
			//String State = data.getString("state");
			try {
				String itemsInfo = instance.getTableInfo("Item","(sellerid="+UserId+" OR buyerid="+UserId+") AND state=2");
				String head="{\"type\":"+"1022"+",\"state\":0,\"data\":{";
				itemsInfo=head+"\"ItemInfoList\":"+itemsInfo;
				itemsInfo=itemsInfo+"}}";
				session.write(new MinaBean(itemsInfo));
			} catch (Exception e) {
				e.printStackTrace();
				session.write(new MinaBean("{\"type\":1022,\"state\":1}"));
				return;
			}

		}
	//Splash                                           //不适用
	private void Splash(IoSession session,String content) throws Exception{
		String cont="{\"type\":99,\"state\":0,\"data\":{\"Splash\":\"";
		String splash=instance.getTableInfo("ad", "AdID", "10000", "Splash");
		JSONObject splashObj=JSON.parseObject(splash);
		String splashStr=splashObj.getString("Splash");
		cont=cont+splashStr+"\"}}";
		session.write(new MinaBean(cont));
	}
	// 返回所有二手商品                                    //ok
	//105
	private void queryAll(IoSession session, String content) throws Exception {
		JSONObject info = JSON.parseObject(content);
		try {
			String itemsInfo = instance.getTableInfo("Item","state=0");
			String head="{\"type\":"+"105"+",\"state\":0,\"data\":{";
			itemsInfo=head+"\"ItemInfoList\":"+itemsInfo;
			itemsInfo=itemsInfo+"}}";
			session.write(new MinaBean(itemsInfo));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":105,\"state\":1}"));
			return;
		}
	}
	// 发布商品   103                                      //ok
	private void newItem(IoSession session, String content) throws Exception {
		JSONObject info = JSON.parseObject(content);
		JSONObject table = info.getJSONObject("data");
		String pic = table.getString("picture");
		
		/*
		 * 接收过来大师兄意向信息 写入数据库
		 */
		try {
			int pk = instance.insertTableInfo("item", table.toJSONString());
			Calendar a=Calendar.getInstance();
			SimpleDateFormat b=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String fbdate=b.format(a.getTime());
			instance.setTableInfo("item", "itemid", pk, "fbdate", fbdate);
			session.write(new MinaBean("{\"type\":103,\"state\":0,\"data\":"+pk+"}"));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":103,\"state\":1}"));
			return;
		}
	}
	// 接受带哥意向信息
	
	
	/*
	 * 106
	 * 卖家取消订单
	 */
	private void sellerCancel(IoSession session,String content ) {
		try {
			JSONObject dataObj=JSON.parseObject(content);
			String dataStr=dataObj.getString("data");
			JSONObject data=JSON.parseObject(dataStr);
			String itemid = data.getString("itemid");
			instance.setTableInfo("item", "itemid", itemid, "state", -1);
			session.write(new MinaBean("{\"type\":106,\"state\":0}"));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":106,\"state\":1}"));
			return;
		}	
	}
	/*
	 * 107
	 * 购买货物
	 */
	private void acceptOrder(IoSession session,String content) throws Exception {
		JSONObject info=JSON.parseObject(content);
		String dataStr=info.getString("data");
		JSONObject data=JSON.parseObject(dataStr);
		int userid=data.getInteger("userid");
		int itemid=data.getInteger("itemid");
		Calendar a=Calendar.getInstance();
		SimpleDateFormat b=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String esdate=b.format(a.getTime());
		instance.setTableInfo("item", "itemid", itemid, "esdate", esdate);
		instance.setTableInfo("item", "itemid", itemid, "buyerid", userid);
		instance.setTableInfo("item", "itemid", itemid, "state", 1);
		session.write(new MinaBean("{\"type\":107,\"state\":0}"));
	}
	/*
	 * 108
	 * 查询订单信息
	 * 带哥
	 */
	
	/*
	 * 合并函数
	 * 将两个jsonArray合并成一个JSONArray
	 */
	private JSONArray mergeJSONArray(JSONArray arr1,JSONArray arr2){
		JSONArray arr = new JSONArray();
		for(int i=0;i<arr1.size();i++){
			arr.add(arr1.get(i));
		}
		for(int i=0;i<arr2.size();i++){
			arr.add(arr2.get(i));
		}
		return arr;
	}
	
	
	/*
	 * 114
	 * 买家取消交易
	 */
	private void  buyerCancel(IoSession session,String content) throws Exception{
		try {
			JSONObject dataObj=JSON.parseObject(content);
			String dataStr=dataObj.getString("data");
			JSONObject data=JSON.parseObject(dataStr);
			String itemid = data.getString("itemid");
			instance.setTableInfo("item", "itemid", itemid, "state", 0);
			session.write(new MinaBean("{\"type\":114,\"state\":0}"));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":114,\"state\":1}"));
			return;
		}	
	}
	/*
	 * 115
	 * 关键字搜索
	 */
	private void keywordSearch(IoSession session, String content) { 
		JSONObject messageObj = JSON.parseObject(content);
		String data = messageObj.getString("data");
		JSONObject obj = JSONObject.parseObject(data);
		try {
			String keyword = obj.getString("keyword");
			String rsarray = instance.getTableInfo("item", "title like '%"+keyword+"%' and state = 0");
			String head="{\"type\":"+"105"+",\"state\":0,\"data\":{";
			String itemsInfo=head+"\"ItemInfoList\":"+rsarray;
			itemsInfo=itemsInfo+"}}";
			session.write(new MinaBean(itemsInfo));
		}catch(Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":115,\"state\":1}"));
		}
	}
	/*
	 * 116
	 */
	private void endTrade(IoSession session, String content) { 
		JSONObject messageObj = JSON.parseObject(content);
		String data = messageObj.getString("data");
		JSONObject obj = JSONObject.parseObject(data);
		try {
			int tradeid = obj.getIntValue("itemid");
			instance.setTableInfo("item", "itemid", tradeid, "state", 2);
			session.write(new MinaBean("{\"type\":116,\"state\":0}"));
		}catch(Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":116,\"state\":1}"));
		}
	}
	private void book(IoSession session, String content) { 
		JSONObject messageObj = JSON.parseObject(content);
		String data = messageObj.getString("data");
		JSONObject obj = JSONObject.parseObject(data);
		try {
			int tradeid = obj.getIntValue("itemid");
			int buyerid = obj.getIntValue("userid");
			String buyerID=String.valueOf(buyerid);
			String sellerid=instance.getTableInfo("item", "itemid", tradeid, "sellerid");
			JSONObject seller = JSON.parseObject(sellerid);
			String sellerID=seller.getString("sellerid");
			if(sellerID.equals(buyerID)) {
				session.write(new MinaBean("{\"type\":119,\"state\":2}"));
				return;
			}
			System.out.println(buyerID);
			System.out.println(sellerid);
			Calendar a=Calendar.getInstance();
			SimpleDateFormat b=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String esdate=b.format(a.getTime());
			instance.setTableInfo("item", "itemid", tradeid, "esdate", esdate);
			instance.setTableInfo("item", "itemid", tradeid, "state", 1);
			instance.setTableInfo("item", "itemid", tradeid, "buyerid", buyerid);
			session.write(new MinaBean("{\"type\":119,\"state\":0}"));
		}catch(Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":119,\"state\":1}"));
		}
	}
	

/*
 * 120 获取个人信息
 */

	private void getUserInfo(IoSession session, String content) throws Exception {
		JSONObject info = JSON.parseObject(content);
		JSONObject table = info.getJSONObject("data");
		String UserID = table.getString("userid");
		
		/*
		 * 接收过来大师兄意向信息 写入数据库
		 */
		try {
			String message="{\"type\":120,\"state\":0,\"data\":"
					+instance.getTableInfo("user", "userid", UserID)+							
					"}";
			session.write(new MinaBean(message));
		} catch (Exception e) {
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":120,\"state\":1}"));
			return;
		}
	}
/*
 * 121      修改个人信息	
 */
	private void setUserInfo(IoSession session, String content) throws Exception {
		JSONObject messageObj = JSON.parseObject(content);
		String data = messageObj.getString("data");
		JSONObject userNameObj=JSON.parseObject(data);
		String UserID=userNameObj.getString("userid");
		String qq=userNameObj.getString("qq");
		String address=userNameObj.getString("address");
		String nickname=userNameObj.getString("nickname");
		String phonenumber=userNameObj.getString("phonenumber");
		String avatar=userNameObj.getString("avatar");
		try {
			instance.setTableInfo("user", "userid", UserID, "qq", qq);
			instance.setTableInfo("user", "userid", UserID, "address", address);
			instance.setTableInfo("user", "userid", UserID, "nickname", nickname);
			instance.setTableInfo("user", "userid", UserID, "phonenumber", phonenumber);
			instance.setTableInfo("user", "userid", UserID, "avatar", avatar);
			String message="{\"type\":121,\"state\":0,\"data\":"
					+instance.getTableInfo("user", "userid", UserID)+							
					"}";
			session.write(new MinaBean(message));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			session.write(new MinaBean("{\"type\":121,\"state\":1}"));
			return;
		}
	}
}
