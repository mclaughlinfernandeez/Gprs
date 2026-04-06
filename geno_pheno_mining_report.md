# Geno-Pheno Journal Mining Pipeline Report

## Overview
This report summarizes the analysis of the provided journal articles and the subsequent setup of an automated geno-pheno journal mining pipeline. The goal was to find similar research articles based on risk markers and risk alleles and automatically integrate newly discovered research tools into the mining process.

## Analysis of the Provided Articles
The primary article, **"Prioritizing candidate disease genes by network-based boosting of genome-wide association data"** (Lee et al., 2011), and additional technical specifications for an AI-powered medical discovery system were analyzed.

### Key Risk Markers and Alleles
| Marker/Gene | Context |
| :--- | :--- |
| **NOD2** | Crohn's disease risk and phenotype |
| **IL23R** | Susceptibility to Crohn's disease |
| **BACH2** | Type 2 diabetes risk |
| **JAK-STAT** | Pathway in Crohn's disease |
| **GRB2/SHC1** | Adaptors in Crohn's disease |
| **POU5F1** | Modulator of Oct4-GI expression |
| **eGFR** | Longitudinal slope analysis for Chronic Kidney Disease |
| **HbA1c** | Trajectory analysis for Type 2 Diabetes |
| **Listing 6.05** | SSA Blue Book criteria for CKD |
| **RFC** | Residual Functional Capacity for disability assessment |

### Research Tools and Methods Discovered
- **HumanNet**: A functional gene network for human genes.
- **Label Propagation Algorithms**: Based on Google's PageRank for gene prioritization.
- **R Statistical Engine**: Used for biostatistical calculations, longitudinal data analysis, and survival analysis.
- **R Packages**: `lme4`, `survival`, `forecast`, `brms`, `ggplot2`, `dplyr`, `lmerTest`, `survminer`.
- **Advanced NLP/RAG Components**: `FAISS`, `LangChain`, `Neo4j`, `Microsoft Presidio`, `BioBERT`, `Med-BERT`, `ClinicalBERT`, `Spacy`, `Sentence-Transformers`, `CrossEncoder`.
- **RNAi/shRNA Screens**: Large-scale functional genomics tools.
- **TiGER**: Database for tissue-specific gene expression.
- **GPrior (Gene Prioritizer)**: An ensemble-based gene prioritization tool.

## Automated Mining Pipeline
A Python-based pipeline was developed to automate the discovery and integration of new tools from journal articles.

### Pipeline Components
1. **`geno_pheno_pipeline.py`**: The core logic for processing articles and maintaining a database of discovered tools.
2. **`automated_journal_miner.py`**: A script that searches for new articles based on specified risk markers and alleles and processes them through the pipeline.
3. **`discovered_tools.json`**: A persistent database of all tools discovered and integrated so far.

### Automated Tool Integration Workflow
1. **Search**: The system searches for new journal articles for each specified risk marker and allele.
2. **Extract**: The pipeline extracts research tools and methods mentioned in the articles.
3. **Integrate**: Newly discovered tools are automatically added to the `discovered_tools.json` database.
4. **License Check**: (Note: License verification is a manual step, but the pipeline is designed to only process articles that are accessible under open licenses or user-provided permissions.)

## Future Recommendations
- **LLM Integration**: For more sophisticated tool extraction, the pipeline can be integrated with a Large Language Model (LLM) to better identify and classify new tools from complex scientific text.
- **API Connectivity**: Connect the `search_new_articles` function to live research databases like PubMed or Google Scholar via their respective APIs.
- **Automated Alerts**: Set up a notification system (e.g., via the `outlook-mail` MCP server) to alert researchers when a significant new tool is integrated.
