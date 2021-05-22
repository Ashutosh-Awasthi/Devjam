# Devjam
SHEPHERD - An online website to revolutionize educational paradigm . 
StudentSite is a webApplication which is aimed to connect students,teachers together for doubt solving, guidance, and study materials. The site uses a post section for students to ask/answer queries, a chat section which connects student realtime for faster resolving of queries. The website is secured local Strategy authentication and can be improved on demand.This application has a very vast scope, both education and e-commerce. For eduction, numerous features can be added like: Video Communication using WebRTC. The Commerce side the site can be monetize for paid services like providing materials. Thus creates a is very scalable application.  

visit the hosted site: https://all-students-related.herokuapp.com/
video explanation: https://drive.google.com/drive/folders/1vbGelzue7RUwZ6uzUKDt3j5jjpfQEmeD?usp=sharing

Backend Overview:
Node-Express server,
Authentication using PassportJs/Bcrypt(hashing),
Chat feature using Socket.io,
Database MongoDB(Mongoose),

Mini features:
After authentication you will be redirected to the previously requested page.
If registration fails the data of the form retains.
Rating System of Posts/QNA section:
	Only Authenticated people can rate/answer/add new queries.
	Visiting unauthenticated users can still view the posts.
	Users cannot spam the ratings of a query as one user can rate only once.
	Posts are sorted in descending order of ratings + number of rates it has to provide best possible answer.
	Only a authorised person can delete/edit his Posts.
	Each Post can be linked with any other post by following two ways:
		reference: Its is answer to the query post, a post can have multiple references(titled as :@QuestionTitle)
				:On deletion of answer, reference of it automatically destroys.
		parent: Its is a question post of the given answer.
		 		:On deletion parent, answers to that post stays on.
	Any Post can be searched using their authorName or Content.(Searches on index text search by MongoDB and Ranks them A/c to score). Best Results appears at the top.
No two persons with same Alias or email can register.
Chat features details:
	Automatically indentifies the current user, and uses its alias to chat.(Ajax request)
	Uses socket for connecting a broadcasting chat. 

FrontEnd features of the chat application:
	Uses web-speech api for speech to text conversion.
	Message is automatically send only if certain words are used while using speech-to-text.
	Micro features:
		On enter Message is send.
