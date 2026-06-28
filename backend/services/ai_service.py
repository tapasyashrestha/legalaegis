def process_notice_pipeline(file_content: bytes, filename: str) -> str:
    """
    Orchestrates the sequential multi-agent RAG pipeline.
    """
    from backend.agents.parser_agent import ParserAgent
    from backend.agents.issue_agent import IssueSpotterAgent
    from backend.agents.query_agent import QueryGeneratorAgent
    from backend.agents.retrieval_agent import RetrievalAgent
    from backend.agents.ranking_agent import ContextRankingAgent
    from backend.agents.citation_agent import CitationVerificationAgent
    from backend.agents.report_agent import ReportGeneratorAgent

    # 1. Parse Document
    text = ParserAgent.parse(file_content)

    # 2. Issue Detection
    issues = IssueSpotterAgent.analyze(text)

    # 3. Query Generation
    queries = QueryGeneratorAgent.generate(issues)

    # 4. Retrieval
    raw_chunks = RetrievalAgent.retrieve(queries)

    # 5. Ranking
    ranked_context = ContextRankingAgent.rank(raw_chunks)

    # 6. Report Generation (Draft)
    draft_report = ReportGeneratorAgent.generate(issues, ranked_context)

    # 7. Citation Verification
    final_report = CitationVerificationAgent.verify(draft_report, ranked_context)

    # Save to Supabase (Mocked)
    report_id = "rep_" + str(hash(filename))
    
    return report_id
