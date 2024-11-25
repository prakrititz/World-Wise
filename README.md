<div align="center">

# **_World Wise 🌍_**  
### **_Your First Export Simplified_**

</div>

---

## **_Introduction_**  
Exporting can be a daunting process, involving extensive documentation, unclear government incentives, and limited knowledge about favorable markets.  
*World_Wise* is here to make exporting accessible, efficient, and hassle-free for everyone.

---

## **_Key Features_**

### **_1. Document Templates_**  
Download ready-made templates for all essential export documents, saving time and ensuring compliance with global standards.

### **_2. Country Risk Analysis_**  
Enter the name of any country, and our ML-powered tool provides a detailed risk assessment, covering economic, political, and market factors.

### **_3. Government Incentives_**  
Discover all applicable government schemes and export incentives tailored to your product, such as mobile phones or textiles, and maximize profitability.

### **_4. AI Negotiation Buddy_**  
Struggling to negotiate deals? Our AI assistant helps you craft professional negotiation responses based on your target price and buyer’s offer.

### **_5. Document Summarizer_**  
Upload lengthy documents in formats like `.pdf`, `.docx`, or `.txt` and get a concise summary, saving time and improving clarity.

### **_6. Step-by-Step Export Guide_**  
A detailed 19-step guide simplifies the export process with explanations of essential steps, including how to obtain an HS Code, IEC, and other required documents.

---

## **_Instructions to Run the Code Locally_**

```bash
# Step 1: Unzip the World_Wise.zip file
unzip World-Wise.zip

# Step 2: Navigate to the project directory
cd World-Wise

# Step 3: Move to the backend directory
cd World_Wise_Backend

# Step 4: Enter your Groq and Gemini API keys in the .env file

# Step 5: Install backend dependencies
pip install -r requirements.txt

# Step 6: Run the backend server
uvicorn main:app --reload

# Step 7: Navigate to the frontend directory
cd ../World_Wise_Frontend

# Step 8: Install frontend dependencies
npm i

# Step 9: Start the frontend server
npm run dev

# Step 10: Copy the frontend URL (e.g., http://localhost:5173) 
# and paste it into the .env file in World_Wise_Backend against the FRONTEND_URL variable.

# Step 11: Open the frontend URL in your browser.
