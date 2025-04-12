document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Typed.js for animated typing effect
    
    // Navbar active state and color change on scroll
    const navbarLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        // Navbar color change on scroll
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        // Update active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navbarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            document.querySelector('.navbar-collapse').classList.remove('show');
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const animateProgressBars = () => {
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transition = 'width 1s ease-in-out';
            }, 100);
        });
    };

    // Call once on page load
    animateProgressBars();

    // Chatbot functionality
    const toggleChatbot = document.getElementById('toggleChatbot');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');

    toggleChatbot.addEventListener('click', function() {
        chatbotContainer.classList.add('active');
    });

    closeChatbot.addEventListener('click', function() {
        chatbotContainer.classList.remove('active');
    });

    sendMessage.addEventListener('click', function() {
        sendUserMessage();
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage('user', message);
        
        // Clear input field
        userInput.value = '';
        
        // Process the message
        processMessage(message);
    }

    function addMessage(sender, message) {
        const now = new Date();
        const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to the bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    async function processMessage(message) {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot');
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatbotMessages.appendChild(typingIndicator);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Remove typing indicator
            chatbotMessages.removeChild(typingIndicator);
            
            // Get bot response
            const response = getBotResponse(message.toLowerCase());
            addMessage('bot', response);
            
        } catch (error) {
            console.error('Error processing message:', error);
            chatbotMessages.removeChild(typingIndicator);
            addMessage('bot', 'Sorry, I encountered an error. Please try again later.');
        }
    }

    function getBotResponse(message) {
        // Convert message to lowercase for case-insensitive matching
        const msg = message.toLowerCase();
        
        // Define response patterns and their corresponding responses
        const responsePatterns = [
            // Education patterns
            {
                patterns: ['Hii', 'hi', 'hello', 'Hello', 'hola', 'hey'],
                response: "Hello! I'm your virtual assistant. How can I help you today?"
             //   response: "I'm pursuing a Bachelor of Technology at IIT Ropar with a CGPA of 7.94 (till 5th Semester). I previously completed Senior Secondary with 94.6% from CBSE in 2022 and Secondary with 89.33% from Board of Secondary Education Rajasthan in 2020. My expected graduation year is 2026."
            },
            {
                patterns: ['education', 'study', 'cgpa', 'degree', 'school'],
                response: "I'm pursuing a Bachelor of Technology at IIT Ropar with a CGPA of 7.94 (till 5th Semester). I previously completed Senior Secondary with 94.6% from CBSE in 2022 and Secondary with 89.33% from Board of Secondary Education Rajasthan in 2020. My expected graduation year is 2026."
            },
            {
                patterns: ['iit', 'college', 'university', 'institute'],
                response: "I'm currently studying at the Indian Institute of Technology (IIT) Ropar, one of India's premier engineering institutions. I'm pursuing a B.Tech degree and expected to graduate in 2026."
            },
            
            // Skills patterns
            {
                patterns: ['skill', 'technologies', 'programming', 'language', 'tech stack'],
                response: "My technical skills include programming languages (C/C++, JavaScript, Java), web technologies (HTML, CSS, Bootstrap, Node.js, Express.js, SQL), and tools like VSCode, GitHub, Arduino, and MATLAB. I'm proficient in data structures and algorithms and have experience with DevOps practices including Git for version control."
            },
            {
                patterns: ['programming language', 'coding language'],
                response: "I'm proficient in several programming languages including C/C++, JavaScript, and Java. I use these languages for both academic projects and competitive programming."
            },
            
            // Project patterns - general
            {
                patterns: ['project', 'work', 'portfolio'],
                response: "My key projects include: Text File Compression using Huffman Algorithm (C++), Real-Time Collaborative Writing Tool (using Node.js, Express.js, Socket.io), Simons Game (HTML/CSS/JS), and other web projects like DogDate and Lisper. Would you like more details about any specific project?"
            },
            
            // Specific project responses
            {
                patterns: ['compression', 'huffman', 'text file'],
                response: "For my Text File Compression project (June 2024), I implemented Huffman Coding, a lossless data compression algorithm in C++. This project reduced data size by assigning variable-length codes to input characters based on their frequencies, generating optimal codes for each character. It demonstrates my skills in algorithm implementation and C++ programming."
            },
            {
                patterns: ['collaborative', 'writing tool', 'real-time'],
                response: "My Real-Time Collaborative Writing Tool is built with HTML, CSS, JavaScript, Node.js, Express.js, EJS, and Socket.io. It enables multiple users to write and edit simultaneously on a shared document with low-latency updates for seamless synchronization between clients. This project showcases my expertise in real-time data synchronization, event-driven programming, and collaborative systems."
            },
            {
                patterns: ['simon', 'game', 'simons game'],
                response: "The Simons Game (June 2024) is a digital version of the classic Simon game implemented using HTML, CSS, JavaScript, and jQuery. I created game mechanics, user interface, and sound effects, utilizing efficient algorithms for random sequence generation and pattern matching. The game features robust error handling and user-friendly messages. You can check it out on my GitHub."
            },
            {
                patterns: ['explain your project', 'describe your project', 'what did you build', 'tell me about your project'],
                response: "Sure! I’ve worked on multiple projects. For example, in my Huffman Coding project, I built a text compression tool using C++. It reduces file size by encoding characters based on frequency. Another is a real-time collaborative editor using Node.js and Socket.io, where multiple users can write on the same document simultaneously, synced in real time. Let me know if you'd like more technical or functional details on any specific one!"
            },
            {
                patterns: ['project motivation', 'why did you build', 'what was the goal of your project'],
                response: "The motivation behind my projects often comes from solving real-world problems or enhancing learning. For instance, Huffman Coding was inspired by the need to efficiently store and transmit text files, while the collaborative editor project aimed to explore real-time synchronization and server-client communication."
            },
            {
                patterns: ['what did you learn', 'learning from project', 'skills gained'],
                response: "From these projects, I gained hands-on experience with algorithms, full-stack development, real-time data handling, and collaborative system design. I also improved my debugging, version control (Git), and teamwork skills during development."
            },
            {
                patterns: ['what did you study', 'your subjects', 'courses you took', 'knowledge from studies'],
                response: "In my B.Tech program, I’ve studied subjects like Data Structures and Algorithms, Computer Architecture, Probability and Statistics, Calculus, and Differential Equations. I also took courses in Electronics and Economics as part of my broader curriculum."
            },
            {
                patterns: ['what do you know about dsa', 'algorithm knowledge', 'data structures'],
                response: "I have a solid understanding of Data Structures like arrays, linked lists, trees, graphs, and hash maps, and I’m proficient with algorithms including sorting, searching, recursion, and graph traversal. I apply this knowledge in both competitive programming and projects."
            },
            {
                patterns: ['what is your minor', 'minor subject', 'what are you doing in cs'],
                response: "I’m pursuing a Minor in Computer Science alongside my Civil Engineering major. This includes studying DSA, Computer Architecture, and software development, which helps me build scalable and efficient software systems."
            },
            
           
        ];
        
        // Check each pattern for a match
        for (const patternObj of responsePatterns) {
            for (const pattern of patternObj.patterns) {
                if (msg.includes(pattern)) {
                    return patternObj.response;
                }
            }
        }
        
        // Default response if no patterns match
        return "I'm sorry, I didn't quite understand that. You can ask me about my education, skills, projects, achievements, courses, or contact information. How can I help you?";
    }
    
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', event => {
        console.log('Button clicked:', event.target.href); // Debugging purposes
    });
});
