declare module "bcrypt" {
  const bcrypt: {
    genSalt?: (...args: any[]) => any;
    genSaltSync?: (...args: any[]) => any;
    hash?: (...args: any[]) => any;
    hashSync?: (...args: any[]) => any;
    compare?: (...args: any[]) => any;
    compareSync?: (...args: any[]) => any;
  };
  export default bcrypt;
}

export {};
