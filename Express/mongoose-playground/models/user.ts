import { model, Schema } from "mongoose";

// _id: false or Mongoose gives every address its own id.
const addressSchema = new Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postcode: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => /^\S+@\S+\.\S+$/.test(value),
        message: (props: { value: string }) => `${props.value} is not an email address`,
      },
    },

    age: {
      type: Number,
      required: true,
      min: 13,
      max: 120,
      validate: {
        validator: Number.isInteger,
        message: "age must be a whole number",
      },
    },

    guardianEmail: {
      type: String,
      lowercase: true,
      trim: true,
      // Must be function, not arrow, so this is the document.
      required: function (this: { age: number }) {
        return this.age < 18;
      },
    },

    address: addressSchema,

    hobbies: {
      type: [String],
      validate: [
        {
          validator: (value: string[]) => value.length <= 5,
          message: "no more than five hobbies",
        },
        {
          validator: (value: string[]) => new Set(value).size === value.length,
          message: "hobbies cannot repeat",
        },
      ],
    },

    isActive: { type: Boolean, default: true },

    createdAt: Date,
    updatedAt: Date,
  },
  {
    // statics lets the user to add user defined static methods to the user schema that can be accessed via the MODEL/
    statics: {
      // Returning this rather than nothing keeps every static's return type
      // inferable. A void return here makes TypeScript lose this on the others.
      sayHi() {
        console.log("Hiiiiii");
        return this;
      },
      getOneByName(name: string) {
        return this.findOne({ name: new RegExp(name, "i") });
      },
    },
    // query lets user add chainable custom query methods that can be used in conjunction with preexisting methods like find, findOne etc
    query: {
      getByAdultAgeLimit() {
        return this.where({ age: { $gte: 18 } });
      },
      getByName(name: string) {
        return this.where({ name: new RegExp(name, "i") });
      },
    },
  }
);

// Must be function, not arrow, so this is the document being saved.
userSchema.pre("save", function () {
  const now = new Date();

  console.log(this);
  if (this.isNew) {
    this.createdAt = now;
  }

  this.updatedAt = now;
});

// Must be function, not arrow. Here this is the query, not a document, because
// an update never loads the document into memory.
userSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});

// Must be function, not arrow, so this is the document.
userSchema.virtual("isAdult").get(function () {
  return this.age >= 18;
});

userSchema.virtual("fullAddress").get(function () {
  if (!this.address) {
    return null;
  }

  return [this.address.street, this.address.city, this.address.postcode].filter(Boolean).join(", ");
});

export const UserModel = model("User", userSchema);
