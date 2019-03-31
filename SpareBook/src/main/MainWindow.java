package main;
import java.awt.Color;

import javax.swing.JFrame;
import javax.swing.UIManager;
import java.net.*;
import java.io.*;

public class MainWindow {
	public static void main(String args[]) {
		ServerFrame frame = new ServerFrame();
		frame.setBackground(Color.white);
		frame.setBounds(100, 100, 650, 500);
		frame.setTitle("sparebook服务器");
		frame.setLocationRelativeTo(null);// 绐椾綋灞呬腑鏄剧ず
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
}
