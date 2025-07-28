
export async function POST(req) {
  try {
    await connectDb();
    const userData = await req.json();
    const { name, email, googleId, picture, emailVerified, locale } = userData;

    const newUser = await User.create({
      name,
      email,
      googleId,
      picture,
      emailVerified,
      locale,
    });

    if (newUser) {
      return NextResponse.json({
        success: true,
        data: newUser,
        message: "User registered successfully",
      });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to register the user. Please try again.",
    });
  } catch (error) {
    // Use proper error logging in production
    console.error("Error in user registration:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong!",
    });
  }
}
