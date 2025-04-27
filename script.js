// Import the Google AI SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- !!! ความปลอดภัย !!! ---
// --- !!! ใส่ API Key ของคุณที่นี่ ---
// --- !!! ห้ามใช้วิธีนี้ใน Production เด็ดขาด !!! ---
const API_KEY = "AIzaSyAWPs8Da9r4FFdWkVMM0jpQG21fQcKc5RM"; // <<<<<<<<<<<<<<< Key จริงของคุณ (ตรวจสอบว่าถูกต้อง)

// --- Initialize Google AI ---
let genAI;
let chatModel;
try {
    // **** แก้ไขเงื่อนไขตรงนี้ ****
    // เช็คว่า Key เป็นค่าว่าง หรือยังเป็น Placeholder เดิมหรือไม่
    if (!API_KEY || API_KEY === "YOUR_API_KEY") { // <--- แก้ไขให้เป็นแบบนี้
        console.warn("API Key is missing or placeholder. AI features will be disabled.");
        // ไม่ต้องซ่อนปุ่มตรงนี้แล้ว จะไปเช็คตอน DOMContentLoaded แทน
    } else {
        // ส่วนนี้ควรจะทำงานได้แล้ว
        genAI = new GoogleGenerativeAI(API_KEY);
        chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // หรือ "gemini-pro"
        console.log("Gemini AI Initialized successfully.");
    }
} catch (error) {
    console.error("Error initializing Google AI:", error);
    // chatModel จะยังเป็น undefined ถ้าเกิด error
}


document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const menuToggleBtn = document.getElementById('menu-toggle');
    const menuCloseBtn = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentYearSpan = document.getElementById('current-year');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    // --- Chatbot Elements ---
    const chatbotWidget = document.getElementById('chatbot-widget');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotLoading = document.getElementById('chatbot-loading');

    // --- Side Menu Toggle ---
    if (menuToggleBtn && sideMenu && menuCloseBtn) {
        menuToggleBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
        });
        menuCloseBtn.addEventListener('click', () => {
            closeSideMenu();
        });
        document.addEventListener('click', (event) => {
            if (sideMenu.classList.contains('open') &&
                !sideMenu.contains(event.target) &&
                !menuToggleBtn.contains(event.target)) {
                closeSideMenu();
            }
        });
        sideMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                 if (link.getAttribute('href').startsWith('#')) {
                    closeSideMenu();
                 }
            });
        });
        function closeSideMenu() {
             sideMenu.classList.remove('open');
        }
    }

    // --- Theme Toggle ---
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        }
    };
    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
        });
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    } else {
        applyTheme('light');
    }

    // --- Product Scroll Buttons & Conditional Logic ---
    const scrollContainers = document.querySelectorAll('.product-scroll-container');
    scrollContainers.forEach(container => {
        const scrollArea = container.querySelector('.product-scroll');
        const prevBtn = container.querySelector('.scroll-btn.prev');
        const nextBtn = container.querySelector('.scroll-btn.next');
        if (!scrollArea) return;
        requestAnimationFrame(() => {
            const isScrollable = scrollArea.scrollWidth > scrollArea.clientWidth + 2;
            if (!isScrollable) {
                container.classList.add('no-scroll');
            } else {
                if (prevBtn && nextBtn) {
                    const itemWidth = scrollArea.querySelector('.product-item')?.offsetWidth || 160;
                    const scrollAmount = itemWidth * 2;
                    prevBtn.addEventListener('click', () => {
                        scrollArea.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });
                    nextBtn.addEventListener('click', () => {
                        scrollArea.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });
                }
            }
        });
    });

    // --- Lightbox Functionality ---
    const productImages = document.querySelectorAll('.product-item img');
    if (lightbox && lightboxImg && lightboxClose) {
        productImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const imgSrc = img.getAttribute('src');
                const imgAlt = img.getAttribute('alt') || "ขยายรูปภาพสินค้า";
                lightboxImg.setAttribute('src', imgSrc);
                lightbox.classList.add('active');
                body.style.overflow = 'hidden';
            });
        });
        lightboxClose.addEventListener('click', () => { closeLightbox(); });
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { closeLightbox(); } });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('active')) { closeLightbox(); } });
        function closeLightbox() {
            lightbox.classList.remove('active');
            body.style.overflow = '';
        }
    } else {
        console.warn("Lightbox elements not found. Image zooming disabled.");
    }

    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth scroll adjustment for fixed header ---
    function adjustScrollForHeader() {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 70; // Get header height or fallback
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                // Use setTimeout to allow browser default scroll first, then adjust
                setTimeout(() => {
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth" // Can be 'auto' if immediate jump is ok
                    });
                }, 0);
            }
        }
    }
    // Adjust scroll on initial load if there's a hash
    // adjustScrollForHeader();
    // Adjust scroll when hash changes (e.g., clicking internal links)
    // window.addEventListener('hashchange', adjustScrollForHeader);


    // --- Slideshow for Design Section ---
    const designSlideshowImage = document.getElementById('design-slideshow-img');
    if (designSlideshowImage) {
        const designImages = [
            'image/S__10166289.jpg', // รูปแรก (รูปเดิม)
            'image/S__36159770.jpg', // << ใส่ path รูปที่ 2 ที่นี่ (ตัวอย่าง)
            'image/S__68329499.jpg', // << ใส่ path รูปที่ 3 ที่นี่ (ตัวอย่าง)
            // เพิ่ม path รูปอื่นๆ ที่ต้องการสลับ ได้ตามต้องการ
            // เช่น 'image/another-design-example.jpg',
        ];
        let currentDesignImageIndex = 0;
        const slideInterval = 4000; // เปลี่ยนรูปทุกๆ 4000 มิลลิวินาที (4 วินาที)

        // ใช้ transition จาก CSS แทน
        // designSlideshowImage.style.transition = 'opacity 0.5s ease-in-out';

        setInterval(() => {
            currentDesignImageIndex = (currentDesignImageIndex + 1) % designImages.length; // วนกลับไปรูปแรก

            // ทำให้รูปจางลงก่อนเปลี่ยน (Optional fade effect)
            designSlideshowImage.style.opacity = 0;

            // รอให้ fade out เสร็จแล้วค่อยเปลี่ยนรูปและ fade in
            setTimeout(() => {
                designSlideshowImage.src = designImages[currentDesignImageIndex];
                designSlideshowImage.alt = `ตัวอย่างการออกแบบหมวก ${currentDesignImageIndex + 1}`; // อัปเดต alt text (ดีต่อ SEO)
                designSlideshowImage.style.opacity = 1; // ทำให้รูปแสดงขึ้น
            }, 500); // รอ 0.5 วินาที (เท่ากับ transition duration ใน CSS)

        }, slideInterval);
    }
    // --- End of Slideshow Code ---


    // --- Chatbot Functionality (NEW) ---

    // **** ตรวจสอบและซ่อนปุ่มถ้า AI Model ไม่พร้อม ****
    if (!chatModel && chatbotToggleBtn) {
         chatbotToggleBtn.style.display = 'none';
         console.warn("Chatbot toggle button hidden because AI model is not available.");
    }

    // เช็คว่าทุกอย่างพร้อมก่อนเพิ่ม Listener (รวมถึง chatModel)
    if (chatbotWidget && chatbotToggleBtn && chatbotCloseBtn && chatbotMessages && chatbotInput && chatbotSendBtn && chatbotLoading && chatModel) {

        // Toggle chat widget visibility
        chatbotToggleBtn.addEventListener('click', () => {
            chatbotWidget.classList.toggle('open');
            if (chatbotWidget.classList.contains('open')) {
                chatbotInput.focus(); // Focus input when opened
            }
        });

        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWidget.classList.remove('open');
        });

        // Function to display messages
        function displayMessage(text, sender) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender); // sender is 'user' or 'ai'
            // Basic Markdown to HTML conversion (bold and lists) - Can be expanded
            let htmlText = text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold **text**
                .replace(/\*(.*?)\*/g, '<em>$1</em>')     // Italic *text*
                .replace(/^- (.*?)(\n|$)/gm, '<li>$1</li>') // List items - item
                .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>'); // Wrap list items in <ul>

            // Handle potential unsafe HTML (simple sanitization)
            // For production, use a proper sanitization library like DOMPurify
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlText;
             // Allow only specific tags (safer than just setting innerHTML)
            const allowedTags = ['strong', 'em', 'ul', 'li', 'br'];
            const cleanNodes = Array.from(tempDiv.childNodes).filter(node => {
                if (node.nodeType === Node.TEXT_NODE) return true;
                if (node.nodeType === Node.ELEMENT_NODE && allowedTags.includes(node.tagName.toLowerCase())) {
                    // Recursively clean child nodes if needed (basic example)
                    return true;
                }
                return false;
            });

            // Append cleaned nodes
            cleanNodes.forEach(node => messageElement.appendChild(node.cloneNode(true)));

            // Fallback if cleaning removed everything (or for plain text)
            if (messageElement.childNodes.length === 0) {
                 messageElement.textContent = text; // Use textContent as fallback
            }


            chatbotMessages.appendChild(messageElement);
            // Scroll to the bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Function to handle sending message
        async function sendMessage() {
            const userInput = chatbotInput.value.trim();
            if (!userInput) return; // Don't send empty messages

            displayMessage(userInput, 'user');
            chatbotInput.value = ''; // Clear input field
            chatbotLoading.style.display = 'block'; // Show loading indicator
            chatbotSendBtn.disabled = true; // Disable send button while loading
            chatbotInput.disabled = true; // Disable input while loading

            try {
                // --- Construct the prompt for Gemini ---
                const prompt = `# Persona & Context
คุณคือผู้ช่วย AI หญิง ที่มีความเชี่ยวชาญและเป็นมิตร ของ **C.A.P. CAP** บริษัทผู้ผลิตและจำหน่ายหมวกสำหรับโรงงานอุตสาหกรรมและหมวกเก็บผมคุณภาพสูง

# Company Information (สำหรับให้ข้อมูลลูกค้าเมื่อจำเป็น)
*   **Facebook:** https://www.facebook.com/share/1DqNFVe4ch/?mibextid=wwXIfr
*   **ที่อยู่:** 110 ซ.สุขสวัสดิ์31/1 เขต ราษฏร์บูรณะ แขวง ราษฎร์บูรณะ กรุงเทพ 10140
*   **Email:** ccap@hotmail.co.th
*   **เบอร์โทรศัพท์:** 0847511751

# Task
หน้าที่ของคุณคือให้ข้อมูล ตอบคำถาม และแนะนำหมวกที่เหมาะสมกับความต้องการของลูกค้าอย่างสุภาพ ชัดเจน และเป็นประโยชน์สูงสุด โดยใช้ภาษาไทยที่เข้าใจง่าย คุณสามารถให้ข้อมูลติดต่อของบริษัทได้หากลูกค้าสอบถาม หรือเมื่อเห็นว่าเหมาะสมเพื่ออำนวยความสะดวก

# Product Catalog
สินค้าหลักของเรามีดังนี้:
*   **หมวกคลุมตาข่ายบน:** เหมาะสำหรับกันผมร่วงหล่นทั่วไป **ระบายอากาศได้ดีเยี่ยม**
*   **หมวกแก๊ปตาข่ายท้ายทอย:** คล้ายหมวกแก๊ป แต่มีตาข่ายด้านหลัง **ช่วยเก็บผมได้ดียิ่งขึ้น**
*   **หมวกแปดเหลี่ยมตาข่ายท้ายทอย:** **ทรงสวยงาม** เก็บผมได้ดี มีตาข่ายด้านหลัง
*   **หมวกคลุมบ่า:** คลุมทั้งศีรษะและบ่า เหมาะสำหรับงานที่ต้องการ**ความสะอาดระดับสูง** หรือป้องกันสิ่งสกปรก/สารเคมีกระเด็น
*   **เน็ตคลุมผม:** แบบตาข่ายล้วน สำหรับเก็บผมอย่างเดียว **ราคาประหยัด ใช้งานง่าย**
*   **หมวกคลุมตาข่ายบนมีตาข่ายท้ายทอย:** **ผสมผสานข้อดี** ของการระบายอากาศด้านบนและการเก็บผมด้านหลังอย่างลงตัว

# Customer Input
คำถาม/ความต้องการของลูกค้า: "${userInput}"

# Instructions for Response
โปรดดำเนินการดังนี้:
1.  **ทำความเข้าใจ** คำถามหรือความต้องการของลูกค้า (${userInput}) อย่างละเอียด
2.  **ให้ข้อมูลและคำแนะนำ** เกี่ยวกับประเภทหมวกที่เหมาะสมที่สุด โดยอ้างอิงจากข้อมูลสินค้าด้านบน
3.  **ตอบคำถาม** อย่างสุภาพ เป็นมิตร และให้ข้อมูลที่เป็นประโยชน์
4.  **ใช้ Markdown** แบบง่ายๆ (เช่น **ตัวหนา** หรือ รายการย่อยด้วย -) เพื่อให้อ่านง่ายและชัดเจน
5.  **เสนอทางเลือกเพิ่มเติม** หากลูกค้ายังไม่แน่ใจ หรือสอบถามข้อมูลอื่นๆ ที่เกี่ยวข้อง
6.  **หากลูกค้าร้องขอข้อมูลติดต่อ หรือดูเหมือนต้องการติดต่อโดยตรง** ให้แจ้งข้อมูลติดต่อ (Facebook, ที่อยู่, Email, เบอร์โทรศัพท์) ที่ให้ไว้ข้างต้น
7.  **ปิดท้ายการสนทนาอย่างเหมาะสม** อาจสอบถามว่าต้องการข้อมูลเพิ่มเติมหรือไม่`;

                const result = await chatModel.generateContent(prompt);
                const response = await result.response;
                const aiText = response.text();

                displayMessage(aiText, 'ai');

            } catch (error) {
                console.error("Error calling Gemini API:", error);
                displayMessage("ขออภัยค่ะ เกิดข้อผิดพลาดในการติดต่อ AI กรุณาลองใหม่อีกครั้ง", 'ai');
            } finally {
                chatbotLoading.style.display = 'none'; // Hide loading indicator
                chatbotSendBtn.disabled = false; // Re-enable send button
                chatbotInput.disabled = false; // Re-enable input
                chatbotInput.focus(); // Focus input again
            }
        }

        // Event listener for send button
        chatbotSendBtn.addEventListener('click', sendMessage);

        // Event listener for Enter key in input field
        chatbotInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });

    } else {
         // ถ้าเงื่อนไขนี้ยังเป็นจริงหลังจาก DOM โหลดแล้ว แสดงว่ามีปัญหาอื่น
         console.warn("Chatbot elements or AI model not fully initialized AFTER DOMContentLoaded. Chatbot disabled.");
         // ซ่อนปุ่มอีกครั้งเพื่อความแน่ใจ
         if(chatbotToggleBtn) chatbotToggleBtn.style.display = 'none';
    }
    // --- End of Chatbot Functionality ---


}); // <-- End of DOMContentLoaded listener