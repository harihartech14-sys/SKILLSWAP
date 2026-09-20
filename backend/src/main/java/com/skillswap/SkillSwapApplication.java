package com.skillswap;

import com.skillswap.model.Skill;
import com.skillswap.model.User;
import com.skillswap.model.UserSkill;
import com.skillswap.model.SkillType;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.repository.UserSkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SkillSwapApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillSwapApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadDemoData(UserRepository userRepository, SkillRepository skillRepository, UserSkillRepository userSkillRepository) {
		return args -> {
			if (userRepository.count() == 0) {
				// Create demo user
				User demoUser = new User();
				demoUser.setName("Demo User");
				demoUser.setUsername("demo");
				demoUser.setPassword("password123");
				demoUser.setEmail("demo@skillswap.com");
				demoUser.setBio("I am the demo user for testing the application.");
				demoUser.setQualification("B.E. Computer Science");
				demoUser.setInstitution("Demo Institute");
				demoUser.setYear(2025);
				demoUser.setCredits(10);
				demoUser.setAverageRating(5.0);
				userRepository.save(demoUser);

				// Create some skills
				Skill java = new Skill();
				java.setName("Java");
				skillRepository.save(java);

				Skill react = new Skill();
				react.setName("React");
				skillRepository.save(react);

				Skill design = new Skill();
				design.setName("UI/UX Design");
				skillRepository.save(design);

				Skill python = new Skill(); python.setName("Python"); skillRepository.save(python);
				Skill marketing = new Skill(); marketing.setName("Digital Marketing"); skillRepository.save(marketing);
				Skill figma = new Skill(); figma.setName("Figma"); skillRepository.save(figma);
				Skill nodejs = new Skill(); nodejs.setName("Node.js"); skillRepository.save(nodejs);

				// Assign skills to demo user
				UserSkill us1 = new UserSkill(); us1.setUser(demoUser); us1.setSkill(java); us1.setSkillType(SkillType.TEACH); userSkillRepository.save(us1);
				UserSkill us2 = new UserSkill(); us2.setUser(demoUser); us2.setSkill(design); us2.setSkillType(SkillType.LEARN); userSkillRepository.save(us2);

				// Create Alice
				User alice = new User(); alice.setName("Alice Smith"); alice.setUsername("alice"); alice.setPassword("alice123"); alice.setEmail("alice@skillswap.com"); alice.setBio("Passionate about UI design."); alice.setCredits(10); alice.setAverageRating(4.8); userRepository.save(alice);
				UserSkill us3 = new UserSkill(); us3.setUser(alice); us3.setSkill(design); us3.setSkillType(SkillType.TEACH); userSkillRepository.save(us3);
				UserSkill us4 = new UserSkill(); us4.setUser(alice); us4.setSkill(java); us4.setSkillType(SkillType.LEARN); userSkillRepository.save(us4);

				// Create Bob
				User bob = new User(); bob.setName("Bob Johnson"); bob.setUsername("bob"); bob.setPassword("bob123"); bob.setEmail("bob@skillswap.com"); bob.setBio("Backend developer exploring frontend."); bob.setCredits(15); bob.setAverageRating(4.5); userRepository.save(bob);
				UserSkill us5 = new UserSkill(); us5.setUser(bob); us5.setSkill(nodejs); us5.setSkillType(SkillType.TEACH); userSkillRepository.save(us5);
				UserSkill us6 = new UserSkill(); us6.setUser(bob); us6.setSkill(react); us6.setSkillType(SkillType.LEARN); userSkillRepository.save(us6);
				UserSkill us6b = new UserSkill(); us6b.setUser(bob); us6b.setSkill(java); us6b.setSkillType(SkillType.LEARN); userSkillRepository.save(us6b);

				// Create Charlie
				User charlie = new User(); charlie.setName("Charlie Davis"); charlie.setUsername("charlie"); charlie.setPassword("charlie123"); charlie.setEmail("charlie@skillswap.com"); charlie.setBio("Marketing guru looking to learn Python."); charlie.setCredits(5); charlie.setAverageRating(4.9); userRepository.save(charlie);
				UserSkill us7 = new UserSkill(); us7.setUser(charlie); us7.setSkill(marketing); us7.setSkillType(SkillType.TEACH); userSkillRepository.save(us7);
				UserSkill us8 = new UserSkill(); us8.setUser(charlie); us8.setSkill(python); us8.setSkillType(SkillType.LEARN); userSkillRepository.save(us8);

				// Create Diana
				User diana = new User(); diana.setName("Diana Prince"); diana.setUsername("diana"); diana.setPassword("diana123"); diana.setEmail("diana@skillswap.com"); diana.setBio("Data scientist willing to teach Python for Figma skills."); diana.setCredits(20); diana.setAverageRating(5.0); userRepository.save(diana);
				UserSkill us9 = new UserSkill(); us9.setUser(diana); us9.setSkill(python); us9.setSkillType(SkillType.TEACH); userSkillRepository.save(us9);
				UserSkill us10 = new UserSkill(); us10.setUser(diana); us10.setSkill(figma); us10.setSkillType(SkillType.LEARN); userSkillRepository.save(us10);

				// Create Ethan
				User ethan = new User(); ethan.setName("Ethan Hunt"); ethan.setUsername("ethan"); ethan.setPassword("ethan123"); ethan.setEmail("ethan@skillswap.com"); ethan.setBio("UI Designer with a focus on Figma."); ethan.setCredits(10); ethan.setAverageRating(4.7); userRepository.save(ethan);
				UserSkill us11 = new UserSkill(); us11.setUser(ethan); us11.setSkill(figma); us11.setSkillType(SkillType.TEACH); userSkillRepository.save(us11);
				UserSkill us12 = new UserSkill(); us12.setUser(ethan); us12.setSkill(marketing); us12.setSkillType(SkillType.LEARN); userSkillRepository.save(us12);
			}
		};
	}
}
