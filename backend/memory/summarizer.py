"""Memory summarization utilities."""

from utils.logger import get_logger

logger = get_logger(__name__)


def _extract_topics(turns: list[dict[str, str]]) -> list[str]:
    words: dict[str, int] = {}
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "with", "and", "or", "it", "that", "this"}
    for turn in turns:
        for word in turn.get("content", "").lower().split():
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
        user_turns = sum(1 for t in turns if t.get("role") == "user")
        assistant_turns = total_turns - user_turns
        summary_parts = [f"Conversation: {total_turns} messages ({user_turns} user, {assistant_turns} assistant)"]
        if topics:
            summary_parts.append(f"Topics: {', '.join(topics)}")
        if total_turns > 2:
            first = turns[0].get("content", "")[:80]
            last = turns[-1].get("content", "")[:80]
            summary_parts.append(f"Start: {first}...")
            summary_parts.append(f"End: {last}...")
        summary = " | ".join(summary_parts)
        logger.info("Generated memory summary", extra={"summary": summary, "turns": total_turns})
        return summary
