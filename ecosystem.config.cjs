module.exports = {
  apps: [
    {
      name: "panelevent-dev",
      cwd: "/home/ubuntu/apps/panelevent",
      script: "npm",
      args: "run dev",          // <- on lance ton script npm
      exec_mode: "fork",
      instances: 1,
      env: { NODE_ENV: "development", PORT: "3000" },
      autorestart: true,
      watch: false,             // nodemon s’occupe déjà du reload
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-err.log",
      time: true
    }
  ]
};
