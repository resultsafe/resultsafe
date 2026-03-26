from __future__ import annotations

import argparse
import json
import sys

from tools.result_api.application.handlers import handle_request


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Result API CLI (Rust-style Ok/Err JSON)")
    parser.add_argument("--id", required=True, help="Identifier to fetch")
    args = parser.parse_args(argv)

    result = handle_request(args.id)
    print(json.dumps(result, ensure_ascii=False))
    return 0 if result.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())
