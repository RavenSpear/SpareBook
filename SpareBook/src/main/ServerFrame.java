package main;

import java.awt.*;
import java.awt.event.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.net.*;
import java.io.*;
import javax.swing.*;

import view.MainView;

import java.sql.*;

public class ServerFrame extends JFrame implements ActionListener {
	//添加两个按钮，打开和关闭服务器
	JButton open = new JButton("打开服务器");
	JButton close = new JButton("关闭服务器");
	//提前定义好需要的 ListenForEver 类，直接在
	//下面的响应中初始化构造监听类
	ListenForever server = null;
	public ServerFrame() {
		//设置界面颜色（虽然用不着）
		setBackground(new Color(0, 128, 128));
		JPanel pCenter = new JPanel();
		pCenter.setBackground(new Color(208, 233, 255));
		//设置布局方式
		pCenter.setLayout(new GridLayout(2, 1));
		//加入按钮
		pCenter.add(open);
		pCenter.add(close); 
		//绑定监听
		open.addActionListener(this);
		close.addActionListener(this);
		//加入滚动条（虽然也用不着）
		ScrollPane scrollPane = new ScrollPane();
		scrollPane.add(pCenter);
		getContentPane().add(scrollPane, BorderLayout.CENTER);
	}
	@Override
	public void actionPerformed(ActionEvent e) {
		// TODO Auto-generated method stub
		if (e.getSource() == open) {
			//开启监听
			//直接new一个监听类，在类中直接构造函数开始监听端口
			server = new ListenForever();
			new MainView();
		}
		else if(e.getSource() == close) {
			//关闭服务器
			//调用dispose方法关闭服务器
			server.acceptor.dispose();
			System.out.println("服务器已关闭");
		}
	}
}
