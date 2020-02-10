type Constructor<T = {}> = new (...args: any[]) => T;


class User {
    name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

// Create a new class by mixing `Timestamped` into `User`
const TimestampedUser = Timestamped(User);

// Instantiate the new `TimestampedUser` class
const user = new TimestampedUser("John Doe");

console.log(user.name);
console.log(user.timestamp);