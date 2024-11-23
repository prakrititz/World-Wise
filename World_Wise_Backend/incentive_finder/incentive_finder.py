import os
from groq import Groq

class StoryQASystem:
    def __init__(self, api_key):
        """
        Initialize the StoryQASystem with your Groq API key
        """
        self.client = Groq(api_key=api_key)
        self.story = None
        
    def set_story(self, story_text):
        """
        Set the story that will be used for answering questions
        """
        self.story = story_text
        
    def ask_question(self, question):
        """
        Ask a question about the stored story
        """
        if not self.story:
            return "Please set a story first using set_story()"
            
        prompt = f"""
Story: {self.story}

Question: {question}

Use the context given to answer the Question.
Answer:"""
        
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[{
                    "role": "user",
                    "content": prompt
                }],
                model="llama3-8b-8192",
                temperature=0.1,
                max_tokens=500,
                top_p=1,
                stream=False
            )
            
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            return f"An error occurred: {str(e)}"

    def find_answer_across_files(self, question, directory="."):
        """
        Search through all text files in the directory until finding an answer
        Returns: tuple (answer, filename) where filename indicates which file provided the answer
        """
        story_files = [f for f in os.listdir(directory) if f.endswith('.txt')]
        
        if not story_files:
            return "No .txt files found in the directory.", None
            
        for file_name in story_files:
            try:
                with open(os.path.join(directory, file_name), 'r') as file:
                    story = file.read()
                
                self.set_story(story)
                answer = self.ask_question(question)
                
                # If the answer doesn't start with "Cannot Answer", we've found a valid answer
                if not answer.strip().startswith("0(Answer Not Found)"):
                    return answer, file_name
                    
                print(f"No answer found in {file_name}, trying next file...")
                
            except Exception as e:
                print(f"Error processing {file_name}: {str(e)}")
                continue
                
        return "No answer found in any file.", None

def main():
    try:
        # Initialize with your API key
        api_key = "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"  # Replace with your actual API key
        if api_key == "your-api-key-here":
            print("Please replace the api_key variable with your actual Groq API key!")
            return
            
        qa_system = StoryQASystem(api_key)
        
        # Interactive question loop
        print("You can now ask questions related to the story. Type 'quit' to exit.")
        
        while True:
            question = input("\nEnter your question: ")
            
            if question.lower() == 'quit':
                print("Exiting the system. Thank you!")
                break
                
            if not question.strip():
                print("Please enter a valid question!")
                continue
                
            print(f"\nSearching for answer to: {question}")
            answer, source_file = qa_system.find_answer_across_files(question)
            
            if source_file:
                print(f"\nFound answer in file: {source_file}")
                print(f"Answer: {answer}")
            else:
                print("Could not find an answer to this question in any file.")
                
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()
