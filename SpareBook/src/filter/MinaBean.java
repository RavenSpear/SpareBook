package filter;

public class MinaBean {
	private String content;
	private boolean isWebAccept=false;
	public MinaBean() {
		
	}
	public MinaBean(String con) {
		content=con;
	}
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isWebAccept() {
		return isWebAccept;
	}

	public void setWebAccept(boolean isWebAccept) {
		this.isWebAccept = isWebAccept;
	}

	@Override
	public String toString() {
		return "MinaBean [content=" + content + "]";
	}

}
