export class MainConfig {
  static getPrismaConfig() {
    return {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    };
  }

  static getServerConfig() {
    return {
      port: process.env.PORT || 3001,
    };
  }
}
