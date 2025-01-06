from whoosh import index
from whoosh.fields import Schema, TEXT
from whoosh.qparser import QueryParser
import os
import psycopg2
from flask import Flask, Response, request
import json

def get_gamenames():
    conn = psycopg2.connect(
        host=os.environ.get("PGHOST"),
        database=os.environ.get("PGDB"),
        user=os.environ.get("PGUSER"),
        password=os.environ.get("PGPASS")
    )
    cur = conn.cursor()
    query = "SELECT array_agg(gamename) FROM a_priority_table WHERE priority <= 3"
    cur.execute(query)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows[0][0]

def create_ix(index_dir):
    os.mkdir(index_dir)
    return index.create_in(index_dir, Schema(name=TEXT(stored=True)))

def populate_ix(ix, gamenames):
    writer = ix.writer()
    for gamename in gamenames:
        writer.add_document(name=gamename)
    writer.commit()

def search_games(ix, query):
    with ix.searcher() as searcher:
        query = QueryParser("name", ix.schema).parse(query)
        results = searcher.search(query, limit=None)
        # return [hit["name"] for hit in results] if results else []
        if results:
            names = []
            for hit in results:
                names.append(hit["name"])
            return names
        return []

def initialize_ix():
    index_dir = "game_index"
    if not os.path.exists(index_dir):
        ix = create_ix(index_dir)
        gamenames = get_gamenames()
        populate_ix(ix, gamenames)
    else:
        ix = index.open_dir(index_dir)
    return ix

app = Flask(__name__)
ix = initialize_ix()

@app.route("/")
def home():
    query = request.args.get("q", type=str)
    if not query:
        return Response(json.dumps([]), status=400, mimetype="application/json")
    names = search_games(ix, query)
    return Response(json.dumps(names), mimetype="application/json")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
