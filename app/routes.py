from flask import Blueprint, request, render_template, redirect, url_for

handlers = Blueprint("handlers", __name__)

@handlers.route("/")
@handlers.route("/<seed>")
def index(seed=""):
    print(seed)
    try:
        seed = int(seed)
    except:
        if seed != "":
            return redirect(url_for("handlers.index"))
    return render_template("index.html", seed=seed)
