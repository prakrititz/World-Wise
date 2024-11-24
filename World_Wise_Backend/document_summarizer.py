from groq import Groq
from typing import Optional, Dict, Any
import PyPDF2
import docx
import markdown
from pathlib import Path
import json
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.markdown import Markdown
from fastapi import UploadFile
from io import BytesIO

class DocumentSummarizer:
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)
        self.console=Console()
        
    def read_uploaded_file(self, file: UploadFile) -> Optional[str]:
        """Extract text from uploaded file"""
        file_ext = Path(file.filename).suffix.lower()
        
        try:
            content = file.file.read()
            
            if file_ext == '.pdf':
                pdf_reader = PyPDF2.PdfReader(BytesIO(content))
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text()
                return text
                
            elif file_ext == '.docx':
                doc = docx.Document(BytesIO(content))
                return "\n".join([paragraph.text for paragraph in doc.paragraphs])
                
            elif file_ext == '.txt':
                return content.decode('utf-8')
                
            elif file_ext in ['.md', '.markdown']:
                md_text = content.decode('utf-8')
                return markdown.markdown(md_text)
                
            else:
                raise ValueError(f"Unsupported file format: {file_ext}")
                
        except Exception as e:
            self.console.print(f"[red]Error reading uploaded file: {str(e)}[/red]")
            return None

    def summarize(self, text: str, max_length: int = 10000) -> Optional[Dict[str, Any]]:
        try:
            # Clean and prepare text
            cleaned_text = ' '.join(text.split())
        
            prompt = f"""
            Provide a clear and concise summary of this trade document dont miss out any point,dont make it too short, it should be of average size.
            Focus on the main points, key requirements, and important details.

            Document text:
            {cleaned_text}
            """

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a document analysis assistant specializing in trade documents. Provide clear, actionable summaries."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama3-8b-8192"
            )

            if chat_completion and chat_completion.choices:
                summary = chat_completion.choices[0].message.content.strip()
                return {"summary": summary}
        
            return {"summary": "Summary generation successful"}

        except Exception as e:
            self.console.print(f"[red]Error in summarization: {str(e)}[/red]")
            return {"summary": "Unable to generate summary"}

    def process_document(self, file: UploadFile) -> Optional[Dict[str, Any]]:
        """Process uploaded document and generate summary"""
        text = self.read_uploaded_file(file)
        if text is None:
            return None
        
        return self.summarize(text)

    def display_summary(self, summary: Dict[str, Any], document_name: str):
        if not summary:
            self.console.print("[red]No summary available to display[/red]")
            return

        self.console.print(f"\n[bold cyan]Document Analysis: {document_name}[/bold cyan]")
        self.console.print("=" * 80 + "\n")

        if summary.get('summary'):
            self.console.print(Panel(
                summary['summary'],
                title="[bold]Document Summary[/bold]",
                border_style="blue"
            ))

        if summary.get('key_points'):
            self.console.print("\n[bold magenta]Key Points:[/bold magenta]")
            for i, point in enumerate(summary['key_points'], 1):
                self.console.print(f"[green]{i}. {point}[/green]")

        if summary.get('stakeholders'):
            self.console.print("\n[bold yellow]Stakeholders:[/bold yellow]")
            for stakeholder in summary['stakeholders']:
                self.console.print(f"[yellow]• {stakeholder}[/yellow]")

        if summary.get('compliance_requirements'):
            self.console.print("\n[bold red]Compliance Requirements:[/bold red]")
            for req in summary['compliance_requirements']:
                self.console.print(f"[blue]• {req}[/blue]")

        if summary.get('important_dates'):
            self.console.print("\n[bold green]Important Dates:[/bold green]")
            for date in summary['important_dates']:                self.console.print(f"[green]• {date}[/green]")


