import Deliverable from "../entities/Deliverable.js";
import User from "../entities/Users.js";
import UserProject from "../entities/UserProjects.js";
import Permission from "../entities/Permissions.js";

const JURY_SIZE = 3;
const MODIFY_WINDOW_HOURS = 48;

async function assignJuryIfNeeded(deliverableId) {
  // 1. Check deliverable
  const deliverable = await Deliverable.findByPk(deliverableId);
  if (!deliverable) return;

  // 2. Only assign jury AFTER due date
  if (new Date(deliverable.DueDate) > new Date()) return;

  // 3. Check if jury already exists for this deliverable
  const existingPermissions = await Permission.findAll({
    where: { DeliverableID: deliverableId },
  });

  if (existingPermissions.length > 0) return;

  // 4. Get PMs for the project
  const projectUsers = await UserProject.findAll({
    where: { ProjectID: deliverable.ProjectID },
  });

  const pmIds = projectUsers.map(p => p.UserID);

  // 5. Get all students EXCEPT PMs
  const users = await User.findAll({
    where: { UserType: "student" },
  });

  const eligible = users.filter(u => !pmIds.includes(u.UserID));

  if (eligible.length < JURY_SIZE) return;

  // 6. Randomly select jury
  const jury = eligible
    .sort(() => 0.5 - Math.random())
    .slice(0, JURY_SIZE);

  // 7. Set grade modification deadline
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + MODIFY_WINDOW_HOURS);

  // 8. Create permissions PER DELIVERABLE
  for (const user of jury) {
    await Permission.create({
      UserID: user.UserID,
      ProjectID: deliverable.ProjectID,
      DeliverableID: deliverableId,
      CanGrade: true,
      CanModifyGrade: true,
      GradeModificationDeadline: deadline,
    });
  }
}

export { assignJuryIfNeeded };
