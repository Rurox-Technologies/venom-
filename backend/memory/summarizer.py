"""Memory summarization utilities."""

from utils.logger import get_logger

logger = get_logger(__name__)


def _extract_topics(turns: list[dict[str, str]]) -> list[str]:
    words: dict[str, int] = {}
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "with", "and", "or", "it", "that", "this"}
    for turn in turns:
        content = turn.get("user") or turn.get("assistant") or turn.get("content", "")
        for word in content.lower().split():
            word = word.strip(".,!?;:'\"()[]{}")
            if word and word not in stop_words and len(word) > 2:
                words[word] = words.get(word, 0) + 1
    sorted_words = sorted(words.items(), key=lambda x: -x[1])
    return [w for w, _ in sorted_words[:10]]


class MemorySummarizer:
    """Summarizes interaction history into compact memory artifacts."""

    async def summarize(self, turns: list[dict[str, str]]) -> str:
        if not turns:
            return ""
        topics = _extract_topics(turns)
        total_turns = len(turns)
        user_count = sum(1 for t in turns if "user" in t)
        assistant_count = sum(1 for t in turns if "assistant" in t)
        summary_parts = [f"Conversation: {total_turns} messages ({user_count} user, {assistant_count} assistant)"]
        if topics:
            summary_parts.append(f"Topics: {', '.join(topics)}")
        if total_turns > 2:
            first = turns[0].get("user") or turns[0].get("assistant") or turns[0].get("content", "")
            last = turns[-1].get("user") or turns[-1].get("assistant") or turns[-1].get("content", "")
            summary_parts.append(f"Start: {first[:80]}...")
            summary_parts.append(f"End: {last[:80]}...")
        summary = " | ".join(summary_parts)
        logger.info("Generated memory summary", extra={"summary": summary, "turns": total_turns})
        return summary
