import json
import os
import requests
from typing import List, Dict

class GenoPhenoPipeline:
    def __init__(self, tools_db_path: str = "/home/ubuntu/discovered_tools.json"):
        self.tools_db_path = tools_db_path
        self.discovered_tools = self.load_tools()

    def load_tools(self) -> Dict:
        if os.path.exists(self.tools_db_path):
            with open(self.tools_db_path, 'r') as f:
                return json.load(f)
        return {"tools": [], "articles_processed": []}

    def save_tools(self):
        with open(self.tools_db_path, 'w') as f:
            json.dump(self.discovered_tools, f, indent=2)

    def extract_tools_from_article(self, article_text: str, article_id: str) -> List[str]:
        # Placeholder for sophisticated extraction logic (LLM-based or NLP)
        # For this demonstration, we use a simple keyword-based approach
        potential_tools = []
        keywords = [
            "HumanNet", "PageRank", "ROC", "RNAi", "shRNA", "TiGER", "GPrior", "Gene Prioritizer",
            "lme4", "survival", "forecast", "brms", "ggplot2", "dplyr", "lmerTest", "survminer",
            "FAISS", "LangChain", "Neo4j", "Microsoft Presidio", "BioBERT", "Med-BERT", "ClinicalBERT",
            "Spacy", "Sentence-Transformers", "CrossEncoder", "RAG Pipeline"
        ]
        for kw in keywords:
            if kw.lower() in article_text.lower():
                potential_tools.append(kw)
        
        # New tool discovery
        new_tools = [t for t in potential_tools if t not in self.discovered_tools["tools"]]
        if new_tools:
            self.discovered_tools["tools"].extend(new_tools)
            self.discovered_tools["articles_processed"].append(article_id)
            self.save_tools()
            print(f"New tools discovered and added: {new_tools}")
        return new_tools

    def process_new_article(self, article_content: str, article_id: str):
        print(f"Processing article: {article_id}")
        new_tools = self.extract_tools_from_article(article_content, article_id)
        # Logic to integrate tools into the mining process
        # e.g., trigger a new search or analysis using the new tool
        return new_tools

if __name__ == "__main__":
    pipeline = GenoPhenoPipeline()
    # Test with a snippet from the analyzed article
    sample_text = "We used HumanNet and a PageRank-based algorithm for disease gene prioritization."
    pipeline.process_new_article(sample_text, "Lee_et_al_2011")
