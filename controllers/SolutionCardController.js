const SolutionCardModel = require("../models/SolutionCardModel");
const UserModel = require("../models/UserModel");

const addSolutionCard = async (req, res) => {
  try {
    const {
      description,
      language,
      custom,
      title,
      info,
      type,
      createdByEmail,
      urlForLiterature,
      urlForTedTalk,
    } = req.body;
    const solutionCard = await SolutionCardModel.create({
      description,
      language,
      title,
      createdByEmail,
      type,
      info,
      custom,
      urlForLiterature,
      urlForTedTalk,
    });
    res.status(201).json({
      success: true,
      message: "Solution Card added successfully",
      data: solutionCard,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ success: false, message: messages.join(", ") });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSolutions = async (req, res) => {
  try {
    const userId = req.params.id;
    const language = req.query.language || "english";

    // Fetch the user email by user ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userEmail = user.email;

    // Fetch solutions filtered by language
    const solutions = await SolutionCardModel.find({ language });

    const categorizedSolutions = {
      Emotional: [],
      Mental: [],
      Physical: [],
      Relations: [],
    };

    // Fetch solutions and categorize them
    solutions.forEach((solution) => {
      if (solution.custom) {
        // If the solution is custom, check the email
        if (solution.createdByEmail === userEmail) {
          switch (solution.type) {
            case "Emotional":
              categorizedSolutions.Emotional.push(solution);
              break;
            case "Mental":
              categorizedSolutions.Mental.push(solution);
              break;
            case "Physical":
              categorizedSolutions.Physical.push(solution);
              break;
            case "Relations":
              categorizedSolutions.Relations.push(solution);
              break;
            default:
              break;
          }
        }
      } else {
        // If the solution is not custom, add it for all users
        switch (solution.type) {
          case "Emotional":
            categorizedSolutions.Emotional.push(solution);
            break;
          case "Mental":
            categorizedSolutions.Mental.push(solution);
            break;
          case "Physical":
            categorizedSolutions.Physical.push(solution);
            break;
          case "Relations":
            categorizedSolutions.Relations.push(solution);
            break;
          default:
            break;
        }
      }
    });

    res.json({
      success: true,
      data: categorizedSolutions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addSolutionCard,
  getSolutions,
};
