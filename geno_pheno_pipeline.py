import json
import os
import re
from typing import List, Dict, Any

class GenoPhenoPipeline:
    """
    Advanced Geno-Pheno Journal Mining Pipeline
    Rebuilt with focus on PQC (Post-Quantum Cryptography) and GPRS (Genomic Privacy and Security).
    """
    def __init__(self, tools_db_path: str = "/home/ubuntu/discovered_tools.json"):
        self.tools_db_path = tools_db_path
        self.discovered_tools = self.load_tools()
        
        # Comprehensive keyword list for tool extraction
        self.keywords = [
            # Original Tools
            "HumanNet", "PageRank", "ROC", "RNAi", "shRNA", "TiGER", "GPrior", "Gene Prioritizer",
            # R-based Statistical Tools
            "lme4", "survival", "forecast", "brms", "ggplot2", "dplyr", "lmerTest", "survminer",
            # AI & RAG Infrastructure
            "FAISS", "LangChain", "Neo4j", "Microsoft Presidio", "BioBERT", "Med-BERT", "ClinicalBERT",
            "Spacy", "Sentence-Transformers", "CrossEncoder", "RAG Pipeline",
            # PQC & GPRS (New Focus)
            "EIGENSTRAT", "FastPCA", "EMMAX", "Genomic Control", "Secure MPC", "TEE", "Trusted Execution Environment",
            "Blockchain", "Federated Learning", "Differential Privacy", "Hyperledger Fabric", "ARM TrustZone",
            "SQLCipher", "Chameleon Hash", "GenDPR", "I-GWAS", "Homomorphic Encryption", "Post-Quantum Cryptography"
        ]

    def load_tools(self) -> Dict[str, Any]:
        if os.path.exists(self.tools_db_path):
            with open(self.tools_db_path, 'r') as f:
                return json.load(f)
        return {"tools": [], "articles_processed": [], "categories": {}}

    def save_tools(self):
        with open(self.tools_db_path, 'w') as f:
            json.dump(self.discovered_tools, f, indent=2)

    def extract_tools(self, text: str) -> List[str]:
        """Enhanced extraction using keyword matching and context-aware patterns."""
        found = []
        for kw in self.keywords:
            if re.search(rf'\b{re.escape(kw)}\b', text, re.IGNORECASE):
                found.append(kw)
        
        # Heuristic for potential new tools (e.g., CamelCase or ALLCAPS words near 'tool', 'algorithm', 'method')
        patterns = [
            r'\b([A-Z][a-z]+[A-Z][a-zA-Z]+)\b', # CamelCase
            r'\b([A-Z]{3,})\b',                # ALLCAPS
        ]
        context_keywords = ["tool", "algorithm", "method", "framework", "pipeline", "system"]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                word = match.group(1)
                if word not in found and word.upper() not in ["GWAS", "SNPS", "CNVS", "GDPR", "PHI", "ICD"]:
                    # Check if any context keyword is nearby (within 50 characters)
                    start, end = match.span()
                    surrounding = text[max(0, start-50):min(len(text), end+50)].lower()
                    if any(ck in surrounding for ck in context_keywords):
                        found.append(word)
        
        return list(set(found))

    def process_article(self, content: str, article_id: str, title: str = ""):
        print(f"Processing: {title if title else article_id}")
        tools = self.extract_tools(content)
        
        new_tools = [t for t in tools if t not in self.discovered_tools["tools"]]
        if new_tools:
            self.discovered_tools["tools"].extend(new_tools)
            if article_id not in self.discovered_tools["articles_processed"]:
                self.discovered_tools["articles_processed"].append(article_id)
            self.save_tools()
            print(f"  -> Discovered: {new_tools}")
        return new_tools

if __name__ == "__main__":
    pipeline = GenoPhenoPipeline()
    # Test with content from the new bibliography
    test_text = "We adapt EIGENSTRAT and FastPCA for Secure MPC and TEE. Our GenDPR framework uses Hyperledger Fabric."
    pipeline.process_article(test_text, "Ostrak_2021", "Implementing Privacy-Preserving Genotype Analysis")
