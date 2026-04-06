import requests
import json
import time
from geno_pheno_pipeline import GenoPhenoPipeline

def search_new_articles(risk_marker: str, risk_allele: str):
    print(f"Searching for new articles for risk marker: {risk_marker}, allele: {risk_allele}")
    # Mock result - In production, this would use a real search API
    return [
        {"id": "PMC8484264", "title": "Prioritization of disease genes from GWAS using ensemble-based positive-unlabeled learning", "content": "In this study, we developed GPrior (Gene Prioritizer) for post-fine-mapping interpretation of GWAS..."},
        {"id": "Nature_2024", "title": "Genetic study of T2DM", "content": "Using a new pipeline called Geno-Pheno-Tool-X for analysis..."},
    ]

def run_automated_mining(risk_markers_alleles: list):
    pipeline = GenoPhenoPipeline()
    for marker, allele in risk_markers_alleles:
        articles = search_new_articles(marker, allele)
        for article in articles:
            new_tools = pipeline.process_new_article(article["content"], article["id"])
            if new_tools:
                print(f"Discovered new tools: {new_tools} in article: {article['id']}")
    
    # Save final results
    pipeline.save_tools()

if __name__ == "__main__":
    # Example risk markers and alleles from the initial article
    targets = [
        ("NOD2", "variant 1"),
        ("IL23R", "risk allele"),
        ("BACH2", "T2DM allele"),
        ("JAK-STAT", "Crohn's variant"),
        ("GRB2", "SHC1 adaptor"),
        ("POU5F1", "Oct4-GI"),
        ("eGFR", "CKD slope"),
        ("HbA1c", "T2DM trajectory"),
        ("Listing 6.05", "Chronic Kidney Disease"),
        ("RFC", "Functional Limitations")
    ]
    run_automated_mining(targets)
