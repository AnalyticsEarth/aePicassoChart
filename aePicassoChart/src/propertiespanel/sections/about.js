let about = {
  type: "items",
  label: "About",
  items: {
    about1: {
      type: "string",
      component: "text",
      label: "Steven Pressland 2018"
    },
    about1a: {
      type: "string",
      component: "text",
      label: "BETA: v" + VERSION
    },
    about2: {
      type: "string",
      component: "text",
      label: "GitHub: www.github.com/analyticsearth"
    },
    about3: {
      type: "string",
      component: "text",
      label: "Picasso Designer is an extension to aid building complex charts based on the Picasso.JS library without having to write any code or understand the picasso JSON structure. The extension also provides support for selections against the chart for the expected user experience in Qlik Sense."
    },
    about4: {
      type: "boolean",
      label: "Enable Experimental Features",
      ref: "picassoprops.enableexp",
      defaultValue: "false"
    }
  }
};

export default about;
