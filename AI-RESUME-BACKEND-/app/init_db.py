from .database import Base, engine
import app.models  # noqa: F401


def init() -> None:
	Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
	init()


