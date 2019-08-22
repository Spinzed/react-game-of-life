from flask import Flask, render_template
from app import create_app

app = create_app()
# note: this may be overcomplicated for such a small app, its
#   that cuz I dont wanna rewrite it later as the project goes on

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug="true")
