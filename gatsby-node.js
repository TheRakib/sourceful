/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allFactory {
        edges {
          node {
            name
            id
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild('Error while running GraphQL query');
    return;
  }

  result.data.allFactory.edges.forEach(({ node }) => {
    const { id, name } = node;
    if (id) {
      createPage({
        path: `factories/${name}`,
        component: require.resolve('./src/templates/factory.js'),
        context: {
          id,
          name,
        },
      });
    } else {
      reporter.warn('###');
      if (name) {
        reporter.warn(`Node with title "${name}" is missing id.`);
      } else {
        reporter.warn(`Node with ID "${id}" is missing name and id`);
      }
      reporter.warn('###');
    }
  });
};
