from datetime import datetime
import re
from typing import Optional, Dict, Any
from duckduckgo_search import DDGS


class AgentTools:
    """AI Agent tools for enhanced chatbot capabilities"""

    @staticmethod
    def web_search(query: str, max_results: int = 3) -> Dict[str, Any]:
        """
        Search the web using DuckDuckGo

        Args:
            query: Search query
            max_results: Maximum number of results to return

        Returns:
            Dictionary with search results
        """
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(query, max_results=max_results))

                formatted_results = []
                for r in results:
                    formatted_results.append({
                        "title": r.get("title", ""),
                        "snippet": r.get("body", ""),
                        "url": r.get("href", "")
                    })

                # Create summary
                summary = "Here's what I found:\n\n"
                for i, r in enumerate(formatted_results, 1):
                    summary += f"{i}. **{r['title']}**\n{r['snippet']}\n\n"

                return {
                    "success": True,
                    "query": query,
                    "results": formatted_results,
                    "summary": summary,
                    "action": "web_search"
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "I couldn't search the web right now. Please try again.",
                "action": "web_search"
            }

    @staticmethod
    def calculate(expression: str) -> Dict[str, Any]:
        """
        Safely evaluate mathematical expressions

        Args:
            expression: Mathematical expression to evaluate

        Returns:
            Dictionary with calculation result
        """
        try:
            # Clean the expression
            expression = expression.strip()

            # Remove any non-mathematical characters for safety
            allowed_chars = set("0123456789+-*/().^ ")
            if not all(c in allowed_chars for c in expression.replace(" ", "")):
                return {
                    "success": False,
                    "error": "Invalid characters in expression",
                    "message": "Please use only numbers and mathematical operators (+, -, *, /, ^, parentheses)",
                    "action": "calculate"
                }

            # Replace ^ with ** for Python
            expression = expression.replace("^", "**")

            # Evaluate safely
            result = eval(expression, {"__builtins__": {}}, {})

            return {
                "success": True,
                "expression": expression.replace("**", "^"),
                "result": result,
                "message": f"The result of {expression.replace('**', '^')} is {result}",
                "action": "calculate"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": "I couldn't calculate that expression. Please check your math syntax.",
                "action": "calculate"
            }

    @staticmethod
    def get_datetime(query: str) -> Dict[str, Any]:
        """
        Get current date/time information

        Args:
            query: User query about date/time

        Returns:
            Dictionary with datetime information
        """
        now = datetime.now()
        query_lower = query.lower()

        response = {}

        if "date" in query_lower:
            response["date"] = now.strftime("%B %d, %Y")
            response["message"] = f"Today's date is {response['date']}."
        elif "time" in query_lower:
            response["time"] = now.strftime("%H:%M:%S")
            response["message"] = f"The current time is {response['time']}."
        elif "day" in query_lower:
            response["day"] = now.strftime("%A")
            response["message"] = f"Today is {response['day']}."
        else:
            response["datetime"] = now.strftime("%A, %B %d, %Y at %H:%M:%S")
            response["message"] = f"It is currently {response['datetime']}."

        return {
            "success": True,
            "action": "get_datetime",
            **response
        }

    @staticmethod
    def detect_intent(query: str) -> Optional[str]:
        """
        Detect user intent to determine which tool to use

        Args:
            query: User query

        Returns:
            Tool name or None
        """
        query_lower = query.lower()

        # Web search patterns
        web_patterns = [
            r"search (for|about|on)",
            r"find (me|information|info|out)",
            r"look up",
            r"google",
            r"what (is|are) (the )?(latest|current|recent)",
            r"tell me about",
            r"news (on|about)",
        ]
        for pattern in web_patterns:
            if re.search(pattern, query_lower):
                return "web_search"

        # Calculator patterns
        calc_patterns = [
            r"calculate",
            r"what is \d+",
            r"compute",
            r"\d+[\+\-\*\/\^]\d+",
            r"solve",
            r"math",
        ]
        for pattern in calc_patterns:
            if re.search(pattern, query_lower):
                return "calculate"

        # DateTime patterns
        datetime_patterns = [
            r"what (is )?(the )?(current|today'?s?)",
            r"what time",
            r"what day",
            r"which day",
            r"date today",
        ]
        for pattern in datetime_patterns:
            if re.search(pattern, query_lower):
                return "datetime"

        return None

    @staticmethod
    def execute_tool(tool_name: str, query: str) -> Dict[str, Any]:
        """
        Execute a specific tool

        Args:
            tool_name: Name of tool to execute
            query: User query

        Returns:
            Tool execution result
        """
        if tool_name == "web_search":
            return AgentTools.web_search(query)
        elif tool_name == "calculate":
            # Extract mathematical expression from query
            expression = query
            for word in ["calculate", "compute", "what is", "solve"]:
                expression = expression.lower().replace(word, "")
            expression = expression.strip(" ?")
            return AgentTools.calculate(expression)
        elif tool_name == "datetime":
            return AgentTools.get_datetime(query)
        else:
            return {
                "success": False,
                "error": f"Unknown tool: {tool_name}",
                "action": None
            }


# Global instance
agent_tools = AgentTools()
